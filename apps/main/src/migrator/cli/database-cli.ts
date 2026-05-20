import { Sequelize, Dialect, QueryTypes } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import * as path from 'path';
import * as fs from 'fs';

import { Definition } from '../definitions';

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(__dirname, '../../../../../.env');
  try {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const eqIdx = trimmed.indexOf('=');
        const key = trimmed.substring(0, eqIdx).trim();
        const value = trimmed.substring(eqIdx + 1).trim();
        const clean = value.replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = clean;
        }
      }
    }
  } catch {
    console.warn('Warning: Could not load .env file.');
  }
  return process.env as Record<string, string>;
}

async function getSettingValues(
  sequelize: Sequelize,
  keys: string[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  for (const key of keys) {
    try {
      const [row]: any = await sequelize.query(
        `SELECT [value] FROM Settings WHERE [key] = '${key}'`,
        { raw: true, type: QueryTypes.SELECT },
      );
      if (row) result.set(key, row.value);
    } catch {
      /* table might not exist yet */
    }
  }
  return result;
}

async function getExecutedNames(
  sequelize: Sequelize,
  tableName: string,
): Promise<string[]> {
  try {
    const rows: any[] = await sequelize.query(
      `SELECT [name] FROM [${tableName}] ORDER BY [name] ASC`,
      { raw: true, type: QueryTypes.SELECT },
    );
    return rows.map((r: any) => r.name);
  } catch {
    return [];
  }
}

async function migrateLegacySeedStorage(sequelize: Sequelize): Promise<void> {
  try {
    const seedRows = await getExecutedNames(sequelize, 'UmzugSeedMeta');
    if (seedRows.length === 0) return;
    const metaRows = await getExecutedNames(sequelize, 'UmzugMeta');
    const metaSet = new Set(metaRows);
    const missing = seedRows.filter((name) => !metaSet.has(name));
    if (missing.length === 0) return;
    console.log(
      `Migrating ${missing.length} legacy seed entries to UmzugMeta...`,
    );
    for (const name of missing) {
      await sequelize.query(`INSERT INTO [UmzugMeta] ([name]) VALUES (?)`, {
        replacements: [name],
      });
    }
    console.log('Done migrating legacy seed storage.\n');
  } catch {
    /* tables may not exist yet */
  }
}

function filterApplicable(
  defs: Definition[],
  settingValues: Map<string, string>,
): Definition[] {
  const core = defs.filter((d) => !d.condition);
  const conditional = defs.filter((d) => d.condition);
  const matching = conditional.filter((d) => {
    const currentValue = settingValues.get(d.condition!.key);
    return currentValue && d.condition!.values.includes(currentValue);
  });
  return [...core, ...matching];
}

function createUmzug(
  sequelize: Sequelize,
  defs: Definition[],
  tableName: string,
  verbose: boolean,
): Umzug {
  return new Umzug({
    migrations: defs.map((def) => ({
      name: def.name,
      up: async () => {
        if (verbose) console.log(`  Running: ${def.name}`);
        await def.up(sequelize);
      },
      down: async () => {
        if (def.down) {
          if (verbose) console.log(`  Reverting: ${def.name}`);
          await def.down(sequelize);
        }
      },
    })),
    storage: new SequelizeStorage({ sequelize, tableName }),
    context: sequelize,
    logger: verbose
      ? console
      : { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} },
  });
}

function findSnapshot(targetName: string): string | null {
  const snapshotsDir = path.resolve(__dirname, '../snapshots');
  const snapshotPath = path.join(snapshotsDir, `${targetName}.snapshot.json`);
  if (fs.existsSync(snapshotPath)) {
    return snapshotPath;
  }
  return null;
}

async function printStatus(
  sequelize: Sequelize,
  defs: Definition[],
): Promise<void> {
  const executedNames = await getExecutedNames(sequelize, 'UmzugMeta');
  const executedSet = new Set(executedNames);
  const pending = defs.filter((d) => !executedSet.has(d.name));

  const latestAvailable = defs.length > 0 ? defs[defs.length - 1].name : 'none';
  const latestExecuted =
    executedNames.length > 0 ? executedNames[executedNames.length - 1] : 'none';

  console.log('=== Database Version Status ===\n');
  console.log('All Definitions (UmzugMeta):');
  console.log(`  Total available:   ${defs.length}`);
  console.log(`  Executed:          ${executedNames.length}`);
  console.log(`  Pending:           ${pending.length}`);
  console.log(`  Latest available:  ${latestAvailable}`);
  console.log(`  Latest executed:   ${latestExecuted}`);
  console.log();

  if (pending.length > 0) {
    console.log('Pending items:');
    for (const d of pending) {
      console.log(
        `  ${d.condition ? '  [conditional]' : '  [core]'} ${d.name}`,
      );
    }
    console.log();
  }
}

async function main(): Promise<void> {
  const env = loadEnv();

  const sequelize = new Sequelize({
    dialect: (env.DB_DIALECT || 'mssql') as Dialect,
    host: env.DB_HOST || '127.0.0.1',
    port: parseInt(env.DB_PORT || '1433', 10),
    username: env.DB_USER || 'sa',
    password: env.DB_PASS || '',
    database: env.DB_NAME_PRODUCTION || '',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('Database connected.\n');
  } catch (err) {
    console.error('Failed to connect to database:', (err as Error).message);
    process.exit(1);
  }

  const { definitions: allDefs } = await import(
    path.resolve(__dirname, '../definitions')
  );

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'status': {
      await printStatus(sequelize, allDefs);
      break;
    }

    case 'update-database': {
      const targetMigration = args[1];
      if (targetMigration) {
        console.log(`Reverting to: ${targetMigration}\n`);
        const snapshotFile = findSnapshot(targetMigration);
        if (snapshotFile) {
          console.log(`  Snapshot available: ${path.basename(snapshotFile)}`);
        } else {
          console.log(`  (No snapshot found for this migration.)`);
        }
        console.log();
        const umzug = createUmzug(sequelize, allDefs, 'UmzugMeta', false);
        const executed = await umzug.executed();
        const targetIdx = executed.findIndex((m) => m.name === targetMigration);
        if (targetIdx === -1) {
          console.error(
            `Migration "${targetMigration}" was not found among executed items.`,
          );
          process.exit(1);
        }
        const countAfterTarget = executed.length - targetIdx - 1;
        if (countAfterTarget > 0) {
          console.log(`Reverting ${countAfterTarget} item(s)...\n`);
          await umzug.down({ step: countAfterTarget });
        } else {
          console.log('Target is the latest item. Nothing to revert.');
        }
        console.log('\nDone.');
      } else {
        await migrateLegacySeedStorage(sequelize);
        console.log('Running all pending definitions...\n');
        const condDefs = allDefs.filter((d) => d.condition);
        const keySet = new Set<string>();
        for (const d of condDefs) {
          const c = d.condition;
          if (c) keySet.add(c.key);
        }
        const uniqueKeys = Array.from(keySet);
        const settingValues = await getSettingValues(sequelize, uniqueKeys);
        const applicable = filterApplicable(allDefs, settingValues);
        const umzug = createUmzug(sequelize, applicable, 'UmzugMeta', true);
        await umzug.up();
        console.log('\nDatabase is up to date.');
      }
      break;
    }

    case 'rollback': {
      console.log('Rolling back last item...\n');
      const umzug = createUmzug(sequelize, allDefs, 'UmzugMeta', false);
      const executed = await umzug.executed();
      if (executed.length === 0) {
        console.log('Nothing to rollback.');
      } else {
        await umzug.down();
        console.log('\nRollback complete.');
      }
      break;
    }

    default: {
      console.log(`
Usage:
  npx ts-node apps/main/src/migrator/cli/database-cli.ts <command> [options]

Commands:
  status                       Show database version status and pending items
  update-database              Apply all pending definitions
  update-database <name>       Revert down to the specified definition
  rollback                     Revert the last applied definition only

Examples:
  npx ts-node apps/main/src/migrator/cli/database-cli.ts status
  npx ts-node apps/main/src/migrator/cli/database-cli.ts update-database
  npx ts-node apps/main/src/migrator/cli/database-cli.ts update-database "20260519-0037-eav-alter-attributetypes-add-valuebased"
  npx ts-node apps/main/src/migrator/cli/database-cli.ts rollback
`);
      if (command) {
        console.error(`Unknown command: ${command}`);
        process.exit(1);
      }
    }
  }

  await sequelize.close();
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
