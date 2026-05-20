import * as fs from 'fs';
import * as path from 'path';
import {
  scanModelsDirectory,
  scanCompiledModelsForClassTable,
  scanCompiledModelsDirectory,
  scanModelFile,
  convertToModelMeta,
} from './model-scanner';
import { loadSnapshot, saveSnapshot, getSnapshotPath } from './snapshot';
import { diffModels, diffHasChanges } from './differ';
import { writeMigrations, getMaxSequenceNumber } from './migration-writer';
import { mapDataType } from './data-type-mapper';
import { ModelMeta, ColumnMeta } from './types';

function usage(): void {
  console.log(`
Usage:
  npx ts-node apps/main/src/migrator/cli/index.ts <command> [options]

Commands:
  snapshot              Create/update snapshot from current models
  backfill-snapshots    Backfill per-migration snapshots for all existing definitions
  diff                  Compare current models with snapshot (show changes)
  generate              Generate migration files from diff
  scan <model-file>     Scan a single model file and print metadata

Options:
  --models-dir <path>   Path to models directory (default: auto-detect)
  --snapshot-dir <path> Path to store snapshot (default: ./migrator)
  --output-dir <path>   Path to output migrations (default: ./migrator/migrations)
  --dry-run             Show what would be generated without writing

Examples:
  npx ts-node apps/main/src/migrator/cli/index.ts snapshot
  npx ts-node apps/main/src/migrator/cli/index.ts backfill-snapshots
  npx ts-node apps/main/src/migrator/cli/index.ts generate
  npx ts-node apps/main/src/migrator/cli/index.ts diff
`);
}

interface MigrationChange {
  type: 'create' | 'addCol' | 'modifyCol' | 'dropCol' | 'none';
  tableName: string;
  colName?: string;
}

function parseMigrationName(name: string): MigrationChange {
  let m: RegExpMatchArray | null;
  m = name.match(/^\d{8}-\d{4}-[a-z]+-create-(.+)-table$/);
  if (m) return { type: 'create', tableName: m[1] };
  m = name.match(/^\d{8}-\d{4}-[a-z]+-alter-(.+)-add-(.+)$/);
  if (m) return { type: 'addCol', tableName: m[1], colName: m[2] };
  m = name.match(/^\d{8}-\d{4}-[a-z]+-alter-(.+)-modify-(.+)$/);
  if (m) return { type: 'modifyCol', tableName: m[1], colName: m[2] };
  m = name.match(/^\d{8}-\d{4}-[a-z]+-alter-(.+)-drop-(.+)$/);
  if (m) return { type: 'dropCol', tableName: m[1], colName: m[2] };
  return { type: 'none', tableName: '' };
}

function findModelByTableName(
  models: Record<string, ModelMeta>,
  searchName: string,
): ModelMeta | undefined {
  const lower = searchName.toLowerCase();
  return Object.values(models).find(
    (m) =>
      m.tableName.toLowerCase() === lower ||
      m.className.toLowerCase() === lower ||
      m.tableName.toLowerCase().includes(lower),
  );
}

/**
 * Parse column definitions from a migration file's createTable() call body.
 * Handles patterns like:
 *   'id BIGINT ' + idCol + ' NOT NULL'
 *   '[version] ' + nv('200') + ' PRIMARY KEY'
 *   '[createdAt] ' + dt()
 */
function parseCreateTableFromMigrationFile(
  filePath: string,
): Record<string, ColumnMeta> {
  const columns: Record<string, ColumnMeta> = {};
  try {
    const code = fs.readFileSync(filePath, 'utf-8');

    // Find the createTable call array content (between [ and ])
    const arrayMatch = code.match(/createTable\s*\([^,]+,\s*\[([\s\S]*?)\]\s*\)/);
    if (!arrayMatch) return columns;

    const arrayContent = arrayMatch[1];
    // Extract each column expression: text between single-quote pairs
    // A column definition is one string expression ending with ' (possibly with + continuation)
    const colLines: string[] = [];
    let current = '';
    let inQuote = false;
    for (let i = 0; i < arrayContent.length; i++) {
      const ch = arrayContent[i];
      if (ch === "'") {
        if (inQuote && i + 1 < arrayContent.length && arrayContent[i + 1] === ' ') {
          // End of quoted string - if next is +, continue collecting
          current += ch;
          inQuote = false;
        } else if (!inQuote) {
          current += ch;
          inQuote = true;
        } else {
          current += ch;
          inQuote = false;
          // End of a string expression that closes the column definition
          if (current.trim().length > 1) {
            colLines.push(current);
          }
          current = '';
        }
      } else {
        current += ch;
      }
    }

    for (const line of colLines) {
      // Reconstruct the full expression by joining string parts
      // 'id BIGINT ' + idCol + ' NOT NULL' -> "id BIGINT BIGINT NOT NULL"
      const reconstructed = line
        .replace(/nv\(['"]?(\d*)['"]?\)/gi, 'NVARCHAR($1)')
        .replace(/dt\(\)/gi, 'DATETIME')
        .replace(/idCol\b/gi, 'BIGINT')
        .replace(/'/g, '')
        .replace(/\s*\+\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!reconstructed) continue;

      const upperExpr = reconstructed.toUpperCase();
      const parts = reconstructed.split(/\s+/);
      const rawName = parts[0].replace(/[\[\]]/g, '');

      // Find SQL type in the expression
      let sqlType = '';
      for (let i = 1; i < parts.length; i++) {
        const p = parts[i].toUpperCase();
        if (/^(NVARCHAR\(\d+\)|VARCHAR\(\d+\)|BIGINT|INT(?:EGER)?|SMALLINT|TINYINT|BIT|BOOLEAN|DATE|DATETIME|FLOAT|DECIMAL|TEXT|NTEXT|UNIQUEIDENTIFIER|VARBINARY(?:\(MAX\))?)$/.test(p)) {
          sqlType = parts[i];
        }
      }
      if (!sqlType) continue;

      const primaryKey = upperExpr.includes('PRIMARY KEY');
      const notNull = upperExpr.includes('NOT NULL');

      columns[rawName] = {
        name: rawName,
        type: mapDataType(sqlType),
        primaryKey,
        autoIncrement: primaryKey && sqlType.toUpperCase().includes('BIGINT'),
        allowNull: !notNull && !primaryKey,
        defaultValue: null,
        unique: false,
        comment: null,
      };
    }
  } catch {
    // File not found or unparseable
  }
  return columns;
}

function findArg(args: string[], key: string): string | undefined {
  const idx = args.indexOf(key);
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return undefined;
}

function autoDetectModelsDir(): string {
  const candidates = [
    'libs/localdatabase/src/models',
    'libs/localdatabase/src/models/eav',
    'libs/localdatabase/src/models/bpmn',
    'node_modules/@rahino/database/src/models',
  ];

  for (const c of candidates) {
    const fullPath = path.resolve(c);
    const fs = require('fs');
    if (fs.existsSync(fullPath)) return fullPath;
  }

  // Fallback: return the most likely path
  return path.resolve('libs/localdatabase/src/models');
}

function autoDetectCoreModelsDir(): string | null {
  const candidates = [
    'node_modules/@rahino/database/dist/models/core',
    'node_modules/@rahino/database/dist/models',
  ];
  const fs = require('fs');
  for (const c of candidates) {
    const fullPath = path.resolve(c);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return null;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    usage();
    return;
  }

  const rootDir = path.resolve(__dirname, '..', '..', '..', '..', '..');
  const modelsDirStr = findArg(args, '--models-dir');
  const modelsDir = modelsDirStr
    ? path.resolve(modelsDirStr)
    : autoDetectModelsDir();
  const snapshotDirStr = findArg(args, '--snapshot-dir');
  const snapshotDir = snapshotDirStr
    ? path.resolve(snapshotDirStr)
    : path.resolve(rootDir, 'apps/main/src/migrator');
  const outputDirStr = findArg(args, '--output-dir');
  const outputDir = outputDirStr
    ? path.resolve(outputDirStr)
    : path.resolve(rootDir, 'apps/main/src/migrator/migrations');
  const dryRun = args.includes('--dry-run');

  // Scan external/core models for class-to-table mapping (e.g., @rahino/database)
  const coreModelsDir = autoDetectCoreModelsDir();
  let extraClassToTable: Record<string, string> | undefined;
  if (coreModelsDir) {
    extraClassToTable = scanCompiledModelsForClassTable(coreModelsDir);
    console.log(
      `Loaded ${Object.keys(extraClassToTable).length} external class-to-table mappings from: ${coreModelsDir}`,
    );
  }

  switch (command) {
    case 'snapshot': {
      console.log(`Scanning local models in: ${modelsDir}`);
      const localModels = scanModelsDirectory(modelsDir, extraClassToTable);

      let compiledModels: Record<string, ModelMeta> = {};
      if (coreModelsDir) {
        compiledModels = scanCompiledModelsDirectory(
          coreModelsDir,
          extraClassToTable,
        );
        console.log(
          `Found ${Object.keys(compiledModels).length} compiled/core models from: ${coreModelsDir}`,
        );
      }

      const allModels = { ...compiledModels, ...localModels };
      console.log(`Total: ${Object.keys(allModels).length} models:`);
      for (const [mname, meta] of Object.entries(allModels)) {
        console.log(
          `  ${meta.tableName} (${Object.keys(meta.columns).length} columns)`,
        );
      }
      const snapshotPath = getSnapshotPath(snapshotDir);
      saveSnapshot(snapshotPath, allModels);
      console.log(`\nSnapshot saved to: ${snapshotPath}`);
      break;
    }

    case 'backfill-snapshots': {
      console.log(`Scanning local models in: ${modelsDir}`);
      const localModels = scanModelsDirectory(modelsDir, extraClassToTable);
      console.log(`Found ${Object.keys(localModels).length} local models`);

      // Also scan compiled models (e.g., @rahino/database core tables)
      let compiledModels: Record<string, ModelMeta> = {};
      if (coreModelsDir) {
        compiledModels = scanCompiledModelsDirectory(
          coreModelsDir,
          extraClassToTable,
        );
        console.log(
          `Found ${Object.keys(compiledModels).length} compiled/core models from: ${coreModelsDir}`,
        );
      }

      // Merge: local models take precedence (they have more accurate column details)
      const allModels = { ...compiledModels, ...localModels };

      const { definitions } = await import(
        path.resolve(rootDir, 'apps/main/src/migrator/definitions')
      );
      const snapshotsDir = path.resolve(
        rootDir,
        'apps/main/src/migrator/snapshots',
      );
      if (!fs.existsSync(snapshotsDir)) {
        fs.mkdirSync(snapshotsDir, { recursive: true });
      }

      const state: Record<string, ModelMeta> = {};
      let created = 0;
      for (const def of definitions) {
        const change = parseMigrationName(def.name);
        if (change.type !== 'none') {
          switch (change.type) {
            case 'create': {
              const model = findModelByTableName(
                allModels,
                change.tableName,
              );
              if (model) {
                state[model.className] = JSON.parse(
                  JSON.stringify(model),
                );
              } else {
                // Try to parse columns from the migration file itself
                const migrationFile = path.resolve(
                  rootDir,
                  'apps/main/src/migrator/migrations',
                  `${def.name}.ts`,
                );
                const fileColumns = parseCreateTableFromMigrationFile(
                  migrationFile,
                );
                state[change.tableName] = {
                  className: change.tableName,
                  tableName: change.tableName,
                  columns:
                    Object.keys(fileColumns).length > 0
                      ? fileColumns
                      : {},
                  indexes: [],
                  foreignKeys: [],
                };
              }
              break;
            }
            case 'addCol':
            case 'modifyCol': {
              const entry = Object.entries(state).find(([_, m]) =>
                m.tableName.toLowerCase().includes(change.tableName.toLowerCase()),
              );
              if (entry) {
                const [, model] = entry;
                const sourceModel = findModelByTableName(
                  allModels,
                  change.tableName,
                );
                const colNameMatch = change.colName!;
                // case-insensitive column lookup
                const sourceCol = sourceModel
                  ? Object.entries(sourceModel.columns).find(
                      ([k]) => k.toLowerCase() === colNameMatch.toLowerCase(),
                    )
                  : undefined;
                if (sourceCol) {
                  model.columns[sourceCol[0]] = JSON.parse(
                    JSON.stringify(sourceCol[1]),
                  );
                } else {
                  model.columns[colNameMatch] = {
                    name: colNameMatch,
                    type: 'UNKNOWN',
                    primaryKey: false,
                    autoIncrement: false,
                    allowNull: true,
                    defaultValue: null,
                    unique: false,
                    comment: null,
                  };
                }
              }
              break;
            }
            case 'dropCol': {
              const entry = Object.entries(state).find(([_, m]) =>
                m.tableName.toLowerCase().includes(change.tableName.toLowerCase()),
              );
              if (entry) {
                const [, model] = entry;
                const dropColName = Object.keys(model.columns).find(
                  (k) => k.toLowerCase() === change.colName!.toLowerCase(),
                );
                if (dropColName) {
                  delete model.columns[dropColName];
                }
              }
              break;
            }
          }
        }
        const snapshotFilePath = path.join(
          snapshotsDir,
          `${def.name}.snapshot.json`,
        );
        if (!fs.existsSync(snapshotFilePath)) {
          saveSnapshot(snapshotFilePath, state);
          created++;
        }
      }
      console.log(
        `\nCreated ${created} per-migration snapshot(s) in: ${snapshotsDir}`,
      );
      break;
    }

    case 'diff': {
      const snapshotPath = getSnapshotPath(snapshotDir);
      const oldSnapshot = loadSnapshot(snapshotPath);
      if (!oldSnapshot) {
        console.error('No snapshot found. Run "snapshot" command first.');
        process.exit(1);
      }
      console.log(`Scanning local models in: ${modelsDir}`);
      const localModels = scanModelsDirectory(modelsDir, extraClassToTable);

      let compiledModels: Record<string, ModelMeta> = {};
      if (coreModelsDir) {
        compiledModels = scanCompiledModelsDirectory(
          coreModelsDir,
          extraClassToTable,
        );
      }
      const newModels = { ...compiledModels, ...localModels };

      const diff = diffModels(
        oldSnapshot.models as Record<string, ModelMeta>,
        newModels,
      );
      console.log(`\nChanges detected:`);
      console.log(`  New tables: ${diff.newTables.length}`);
      for (const t of diff.newTables) {
        console.log(`    + ${t.tableName}`);
      }
      console.log(`  Removed tables: ${diff.removedTables.length}`);
      for (const t of diff.removedTables) {
        console.log(`    - ${t.tableName}`);
      }
      console.log(`  Column changes: ${diff.diffColumns.length}`);
      for (const c of diff.diffColumns) {
        console.log(
          `    ${c.action === 'add' ? '+' : c.action === 'remove' ? '-' : '~'} ${c.tableName}.${c.column.name} (${c.action})`,
        );
      }
      break;
    }

    case 'generate': {
      const snapshotPath = getSnapshotPath(snapshotDir);
      const oldSnapshot = loadSnapshot(snapshotPath);
      if (!oldSnapshot) {
        console.error('No snapshot found. Run "snapshot" command first.');
        process.exit(1);
      }
      console.log(`Scanning local models in: ${modelsDir}`);
      const localModels = scanModelsDirectory(modelsDir, extraClassToTable);

      let compiledModels: Record<string, ModelMeta> = {};
      if (coreModelsDir) {
        compiledModels = scanCompiledModelsDirectory(
          coreModelsDir,
          extraClassToTable,
        );
      }
      const newModels = { ...compiledModels, ...localModels };
      const diff = diffModels(
        oldSnapshot.models as Record<string, ModelMeta>,
        newModels,
      );

      if (!diffHasChanges(diff)) {
        console.log('No changes detected. Models match snapshot.');
        return;
      }

      console.log(`\nChanges:`);
      console.log(`  New tables: ${diff.newTables.length}`);
      console.log(`  Removed tables: ${diff.removedTables.length}`);
      console.log(`  Column changes: ${diff.diffColumns.length}`);

      if (dryRun) {
        console.log('\n[Dry Run] Would generate:');
        for (const t of diff.newTables) {
          console.log(`  + CREATE TABLE ${t.tableName}`);
        }
        for (const c of diff.diffColumns) {
          console.log(
            `  ${c.action === 'add' ? '+' : c.action === 'remove' ? '-' : '~'} ALTER TABLE ${c.tableName} ${c.action} ${c.column.name}`,
          );
        }
      } else {
        const migratorRoot = path.resolve(outputDir, '..');
        const maxSeq = getMaxSequenceNumber(migratorRoot);
        const indexFile = path.join(outputDir, 'index.ts');
        const files = writeMigrations(
          outputDir,
          diff,
          maxSeq,
          indexFile,
        );
        console.log(
          `\nGenerated ${files.length} migration file(s) in: ${outputDir}`,
        );
        for (const f of files) {
          console.log(`  - ${f}`);
        }
        console.log(`\nIndex updated: ${indexFile}`);

        // Build incremental per-migration snapshots
        const snapshotsDir = path.resolve(rootDir, 'apps/main/src/migrator/snapshots');
        if (!fs.existsSync(snapshotsDir)) {
          fs.mkdirSync(snapshotsDir, { recursive: true });
        }
        const incrementalModels: Record<string, ModelMeta> = oldSnapshot?.models
          ? JSON.parse(JSON.stringify(oldSnapshot.models))
          : {};
        const orderedChanges: Array<
          | { type: 'newTable'; model: ModelMeta }
          | { type: 'columnChange'; tableName: string; column: ColumnMeta; action: string }
        > = [];
        for (const model of diff.newTables) {
          orderedChanges.push({ type: 'newTable', model });
        }
        for (const dc of diff.diffColumns) {
          orderedChanges.push({ type: 'columnChange', tableName: dc.tableName, column: dc.column, action: dc.action });
        }
        for (let i = 0; i < files.length; i++) {
          const change = orderedChanges[i];
          if (change) {
            if (change.type === 'newTable') {
              incrementalModels[change.model.className] = JSON.parse(JSON.stringify(change.model));
            } else if (change.type === 'columnChange') {
              const entry = Object.entries(incrementalModels).find(
                ([_, m]) => m.tableName === change.tableName,
              );
              if (entry) {
                const [, model] = entry;
                if (change.action === 'add' || change.action === 'alter') {
                  model.columns[change.column.name] = JSON.parse(JSON.stringify(change.column));
                } else if (change.action === 'remove') {
                  delete model.columns[change.column.name];
                }
              }
            }
          }
          const migrationName = files[i].replace(/\.ts$/, '');
          const migrationSnapshotPath = path.join(snapshotsDir, `${migrationName}.snapshot.json`);
          saveSnapshot(migrationSnapshotPath, incrementalModels);
          console.log(`  Snapshot: ${migrationName}.snapshot.json`);
        }

        // Update main snapshot after generation
        saveSnapshot(snapshotPath, newModels);
        console.log(`\nSnapshot updated: ${snapshotPath}`);
      }
      break;
    }

    case 'scan': {
      const filePath = args[1];
      if (!filePath) {
        console.error('Usage: scan <model-file.ts>');
        process.exit(1);
      }
      const fullPath = path.resolve(filePath);
      const parsed = scanModelFile(fullPath);
      if (!parsed) {
        console.error('No model found in file (no @Table decorator detected)');
        process.exit(1);
      }
      const meta = convertToModelMeta(parsed);
      console.log(JSON.stringify(meta, null, 2));
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      usage();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
