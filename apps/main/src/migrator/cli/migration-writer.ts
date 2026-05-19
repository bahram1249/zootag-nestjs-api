import * as fs from 'fs';
import * as path from 'path';
import { ModelMeta, DiffResult, ColumnMeta, ForeignKeyMeta } from './types';

function pad(n: number): string {
  return n.toString().padStart(4, '0');
}

function datePrefix(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}${m}${day}`;
}

function displayColName(colName: string): string {
  return colName === 'createdAt' || colName === 'updatedAt'
    ? `[${colName}]`
    : colName;
}

function typeToHelperExpr(type: string, helpers: Set<string>): string | null {
  const upper = type.toUpperCase();
  if (upper.startsWith('NVARCHAR(')) {
    const match = type.match(/NVARCHAR\((\d+|MAX)\)/i);
    helpers.add('nv');
    return `nv('${match ? match[1] : '255'}')`;
  }
  if (upper === 'NTEXT') {
    helpers.add('text');
    return 'text()';
  }
  if (upper === 'BIT') {
    helpers.add('bit');
    return 'bit()';
  }
  if (upper === 'DATETIMEOFFSET') {
    helpers.add('dt');
    return 'dt()';
  }
  return null;
}

function buildCreateColumnExpr(
  col: ColumnMeta,
  fkMap: Map<string, ForeignKeyMeta>,
  helpers: Set<string>,
  tableName: string,
): string {
  const colName = displayColName(col.name);
  const isIdentity = col.autoIncrement && col.primaryKey;

  if (isIdentity) {
    const isBig = col.type.startsWith('BIGINT');
    helpers.add('idCol');
    helpers.add('pk');
    return `'${colName} ${isBig ? 'BIGINT' : 'INT'} ' + idCol + ' ' + pk`;
  }

  const type = col.type.toUpperCase();
  const typeExpr = typeToHelperExpr(col.type, helpers);

  const nullStr = col.allowNull ? ' NULL' : ' NOT NULL';
  const defaultStr = col.defaultValue ? ` DEFAULT ${col.defaultValue}` : '';
  const pkStr = col.primaryKey ? ' PRIMARY KEY' : '';

  let expr: string;
  if (typeExpr) {
    if (type === 'DATETIMEOFFSET') {
      const suffix = pkStr ? ` + '${pkStr}'` : '';
      expr = `'${colName} ' + ${typeExpr}${suffix}`;
    } else {
      expr = `'${colName} ' + ${typeExpr} + '${nullStr}${defaultStr}${pkStr}'`;
    }
  } else {
    expr = `'${colName} ${type}${nullStr}${defaultStr}${pkStr}'`;
  }

  const fk = fkMap.get(col.name);
  if (fk) {
    helpers.add('ref');
    const refCol = fk.refColumns[0] || 'id';
    expr += ` + ' ' + ref('${fk.refTable}', '${refCol}', '${tableName}', '${col.name}')`;
  }

  return expr;
}

function generateCreateTableMigration(
  model: ModelMeta,
  seqNum: number,
): string {
  const prefix = datePrefix();
  const tableName = model.tableName;
  const name = `${prefix}-${pad(seqNum)}-create-${tableName.toLowerCase()}`;

  const fkMap = new Map<string, ForeignKeyMeta>();
  if (model.foreignKeys) {
    for (const fk of model.foreignKeys) {
      if (fk.columns.length > 0) {
        fkMap.set(fk.columns[0], fk);
      }
    }
  }

  const helpers = new Set<string>(['createTable']);
  const colExprs: string[] = [];
  for (const col of Object.values(model.columns)) {
    colExprs.push(buildCreateColumnExpr(col, fkMap, helpers, tableName));
  }

  // Append createdAt/updatedAt timestamps if not defined in entity
  // Sequelize's Model base class expects these columns to exist
  if (!model.columns['createdAt']) {
    helpers.add('dt');
    colExprs.push(`'[createdAt] ' + dt()`);
  }
  if (!model.columns['updatedAt']) {
    helpers.add('dt');
    colExprs.push(`'[updatedAt] ' + dt()`);
  }

  const helpersStr = Array.from(helpers).join(', ');

  return `
import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '${name}';

export async function up(sequelize: Sequelize): Promise<void> {
  const { ${helpersStr} } = createDialectHelpers(sequelize);

  await createTable('${tableName}', [
${colExprs.map((e) => `    ${e},`).join('\n')}
  ].join(',\\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('${tableName}');
}
`;
}

function constraintName(tableName: string, colName: string): string {
  return `FK_${tableName}_${colName.charAt(0).toUpperCase() + colName.slice(1)}`;
}

function generateAddColumnMigration(
  tableName: string,
  col: ColumnMeta,
  seqNum: number,
): string {
  const prefix = datePrefix();
  const name = `${prefix}-${pad(seqNum)}-alter-${tableName.toLowerCase()}-add-${col.name.toLowerCase()}`;
  const helpers = new Set<string>(['addColumn']);
  const nullStr = col.allowNull ? 'true' : 'false';
  const defStr = col.defaultValue ? `'${col.defaultValue}'` : 'undefined';

  const typeExpr = typeToHelperExpr(col.type, helpers);
  const typeArg = typeExpr || `'${col.type}'`;

  let constraintExpr = 'undefined';
  const hasFk = col.references;
  if (hasFk) {
    const ref = col.references!;
    const cName = constraintName(tableName, col.name);
    helpers.add('fkConstraint');
    constraintExpr = `fkConstraint('${cName}', '${ref.model}', '${ref.key}')`;
  }

  const helpersStr = Array.from(helpers).join(', ');

  const downLines: string[] = [];
  const cstrName = hasFk
    ? `'${constraintName(tableName, col.name)}'`
    : 'undefined';
  helpers.add('dropColumn');
  downLines.push(`  const { dropColumn } = createDialectHelpers(sequelize);`);
  downLines.push(
    `  await dropColumn('${tableName}', '${col.name}', ${cstrName});`,
  );

  const lines = [
    `import { Sequelize } from 'sequelize';`,
    `import { createDialectHelpers } from '../migration-helper';`,
    ``,
    `export const name = '${name}';`,
    ``,
    `export async function up(sequelize: Sequelize): Promise<void> {`,
    `  const { ${helpersStr} } = createDialectHelpers(sequelize);`,
    `  await addColumn('${tableName}', '${col.name}', ${typeArg}, ${nullStr}, ${defStr}, ${constraintExpr});`,
    `}`,
    ``,
    `export async function down(sequelize: Sequelize): Promise<void> {`,
    downLines.join('\n'),
    `}`,
    ``,
  ];

  return lines.join('\n');
}

function generateAlterColumnMigration(
  tableName: string,
  col: ColumnMeta,
  oldCol: ColumnMeta | undefined,
  seqNum: number,
): string {
  const prefix = datePrefix();
  const name = `${prefix}-${pad(seqNum)}-alter-${tableName.toLowerCase()}-modify-${col.name.toLowerCase()}`;
  const helpers = new Set<string>(['alterColumn']);

  const typeExpr = typeToHelperExpr(col.type, helpers);
  const newType = typeExpr || `'${col.type}'`;

  let downType: string;
  if (oldCol) {
    const oldTypeExpr = typeToHelperExpr(oldCol.type, helpers);
    downType = oldTypeExpr || `'${oldCol.type}'`;
  } else {
    downType = newType;
  }

  const helpersStr = Array.from(helpers).join(', ');
  const nullStr = col.allowNull ? 'true' : 'false';

  const lines = [
    `import { Sequelize } from 'sequelize';`,
    `import { createDialectHelpers } from '../migration-helper';`,
    ``,
    `export const name = '${name}';`,
    ``,
    `export async function up(sequelize: Sequelize): Promise<void> {`,
    `  const { ${helpersStr} } = createDialectHelpers(sequelize);`,
    `  await alterColumn('${tableName}', '${col.name}', ${newType}, ${nullStr});`,
    `}`,
    ``,
    `export async function down(sequelize: Sequelize): Promise<void> {`,
    `  const { alterColumn } = createDialectHelpers(sequelize);`,
    `  await alterColumn('${tableName}', '${col.name}', ${downType}, ${nullStr});`,
    `}`,
    ``,
  ];

  return lines.join('\n');
}

function generateDropColumnMigration(
  tableName: string,
  col: ColumnMeta,
  seqNum: number,
): string {
  const prefix = datePrefix();
  const name = `${prefix}-${pad(seqNum)}-alter-${tableName.toLowerCase()}-drop-${col.name.toLowerCase()}`;
  const helpers = new Set<string>(['dropColumn']);
  const typeExpr = typeToHelperExpr(col.type, helpers);
  const typeArg = typeExpr || `'${col.type}'`;
  const nullStrB = col.allowNull ? 'true' : 'false';
  const defStr = col.defaultValue ? `'${col.defaultValue}'` : 'undefined';
  const helpersStr = Array.from(helpers).join(', ');

  const lines = [
    `import { Sequelize } from 'sequelize';`,
    `import { createDialectHelpers } from '../migration-helper';`,
    ``,
    `export const name = '${name}';`,
    ``,
    `export async function up(sequelize: Sequelize): Promise<void> {`,
    `  const { ${helpersStr} } = createDialectHelpers(sequelize);`,
    `  await dropColumn('${tableName}', '${col.name}', undefined);`,
    `}`,
    ``,
    `export async function down(sequelize: Sequelize): Promise<void> {`,
    `  const { addColumn } = createDialectHelpers(sequelize);`,
    `  await addColumn('${tableName}', '${col.name}', ${typeArg}, ${nullStrB}, ${defStr}, undefined);`,
    `}`,
    ``,
  ];

  return lines.join('\n');
}

function tableToSite(tableName: string): string | null {
  const upper = tableName.toUpperCase();
  if (upper.startsWith('BPMN')) return 'bpmn';
  if (upper.startsWith('EAV')) return 'ecommerce';
  return null;
}

function updateIndexFile(
  indexFilePath: string,
  createdFiles: Array<{ fileName: string; tableName: string }>,
  existingCount: number,
): void {
  if (!fs.existsSync(indexFilePath)) return;

  let content = fs.readFileSync(indexFilePath, 'utf-8');

  let nextNum = existingCount + 1;
  const imports: string[] = [];
  const entries: string[] = [];

  for (const { fileName, tableName } of createdFiles) {
    const fileBase = fileName.replace(/\.ts$/, '');
    const varName = `m${pad(nextNum)}`;
    imports.push(`import * as ${varName} from './${fileBase}';`);

    const site = tableToSite(tableName);
    if (site) {
      entries.push(`cond(${varName}, 'SITE_NAME', '${site}')`);
    } else {
      entries.push(`m(${varName})`);
    }
    nextNum++;
  }

  // Append imports before the blank line that starts the condition interface
  const importEndMatch = content.match(/\n\ninterface Condition/);
  if (importEndMatch) {
    const insertPos = importEndMatch.index! + 1; // after the newline before blank line
    content =
      content.slice(0, insertPos) +
      '\n' +
      imports.join('\n') +
      content.slice(insertPos);
  } else {
    // Fallback: append after last import
    const lastImportMatch = content.match(/^import .+$/m);
    if (lastImportMatch) {
      const linesArr = content.split('\n');
      let lastImportIdx = -1;
      for (let i = 0; i < linesArr.length; i++) {
        if (linesArr[i].startsWith('import ')) lastImportIdx = i;
      }
      if (lastImportIdx >= 0) {
        linesArr.splice(lastImportIdx + 1, 0, '', ...imports);
        content = linesArr.join('\n');
      }
    }
  }

  // Append entries to the migrations array
  // Find the closing bracket of the array
  const arrayEndMatch = content.match(/];\s*$/m);
  if (arrayEndMatch) {
    const insertPos = arrayEndMatch.index!;
    const indent = '  ';
    const entriesWithComma = entries.map((e) => `${indent}${e},`);
    content =
      content.slice(0, insertPos) +
      entriesWithComma.join('\n') +
      '\n' +
      content.slice(insertPos);
  }

  fs.writeFileSync(indexFilePath, content, 'utf-8');
}

export function writeMigrations(
  migrationsDir: string,
  diff: DiffResult,
  existingCount: number,
  indexFilePath?: string,
): string[] {
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  let seq = existingCount + 1;
  const createdFiles: Array<{ fileName: string; tableName: string }> = [];

  for (const model of diff.newTables) {
    const content = generateCreateTableMigration(model, seq);
    const fileName = `${datePrefix()}-${pad(seq)}-create-${model.tableName.toLowerCase()}.ts`;
    const filePath = path.join(migrationsDir, fileName);
    fs.writeFileSync(filePath, content.trimStart(), 'utf-8');
    createdFiles.push({ fileName, tableName: model.tableName });
    seq++;
  }

  for (const diffCol of diff.diffColumns) {
    let content: string;
    switch (diffCol.action) {
      case 'add':
        content = generateAddColumnMigration(
          diffCol.tableName,
          diffCol.column,
          seq,
        );
        break;
      case 'alter':
        content = generateAlterColumnMigration(
          diffCol.tableName,
          diffCol.column,
          diffCol.oldColumn,
          seq,
        );
        break;
      case 'remove':
        content = generateDropColumnMigration(
          diffCol.tableName,
          diffCol.column,
          seq,
        );
        break;
    }
    const actionWord =
      diffCol.action === 'remove'
        ? 'drop'
        : diffCol.action === 'alter'
          ? 'modify'
          : 'add';
    const fileName = `${datePrefix()}-${pad(seq)}-alter-${diffCol.tableName.toLowerCase()}-${actionWord}-${diffCol.column.name.toLowerCase()}.ts`;
    const filePath = path.join(migrationsDir, fileName);
    fs.writeFileSync(filePath, content.trimStart(), 'utf-8');
    createdFiles.push({ fileName, tableName: diffCol.tableName });
    seq++;
  }

  // Update index.ts if path provided
  if (indexFilePath) {
    updateIndexFile(indexFilePath, createdFiles, existingCount);
  }

  return createdFiles.map((f) => f.fileName);
}

export function getExistingMigrationCount(migrationsDir: string): number {
  if (!fs.existsSync(migrationsDir)) return 0;
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts');
  return files.length;
}
