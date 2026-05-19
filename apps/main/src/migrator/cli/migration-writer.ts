import * as fs from 'fs';
import * as path from 'path';
import { ModelMeta, DiffResult } from './types';

let migrationCounter = 0;

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

function columnToSql(col: {
  name: string;
  type: string;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  allowNull?: boolean;
  defaultValue?: string | null;
  unique?: boolean;
}, helpers: string): string {
  const { q, idCol, nv, colType } = extractHelpers(helpers);
  const colName = q(col.name);
  let sql = colName;

  const isIdentity = col.autoIncrement && col.primaryKey;
  if (isIdentity) {
    const isBig = col.type.startsWith('BIGINT');
    sql += ` ${isBig ? 'BIGINT' : 'INT'} ${idCol} NOT NULL`;
  } else {
    const sqlType = mapToHelper(col.type, helpers);
    sql += ` ${sqlType}`;
    if (!col.allowNull) sql += ' NOT NULL';
    if (col.defaultValue) sql += ` DEFAULT ${col.defaultValue}`;
  }
  if (col.primaryKey && !isIdentity) sql += ' PRIMARY KEY';

  return sql;
}

function extractHelpers(h: string): any {
  return {
    q: (s: string) => `[${s}]`,
    idCol: 'IDENTITY(1,1)',
    nv: (len: string) => `NVARCHAR(${len})`,
    colType: (t: string) => t,
  };
}

function mapToHelper(type: string, _helpers: string): string {
  if (type.startsWith('NVARCHAR')) return type;
  if (type === 'NTEXT') return 'NTEXT';
  if (type === 'BIT') return 'BIT';
  if (type === 'BIGINT') return 'BIGINT';
  if (type === 'INT') return 'INT';
  if (type === 'SMALLINT') return 'SMALLINT';
  if (type === 'TINYINT') return 'TINYINT';
  if (type === 'FLOAT') return 'FLOAT';
  if (type === 'DATETIME' || type === 'DATETIMEOFFSET') return 'DATETIMEOFFSET';
  if (type === 'DATE') return 'DATE';
  if (type === 'TIME') return 'TIME';
  if (type === 'UNIQUEIDENTIFIER') return 'UNIQUEIDENTIFIER';
  return type;
}

function columnLines(model: ModelMeta): string[] {
  const lines: string[] = [];
  for (const col of Object.values(model.columns)) {
    const parts: string[] = [];
    const colName = `[${col.name}]`;
    const isIdentity = col.autoIncrement && col.primaryKey;

    if (isIdentity) {
      const isBig = col.type.startsWith('BIGINT');
      parts.push(`${colName} ${isBig ? 'BIGINT' : 'INT'} IDENTITY(1,1) NOT NULL`);
    } else {
      parts.push(`${colName} ${mapToHelper(col.type, '')}`);
      if (!col.allowNull) parts[parts.length - 1] += ' NOT NULL';
      else parts[parts.length - 1] += ' NULL';
      if (col.defaultValue) parts[parts.length - 1] += ` DEFAULT ${col.defaultValue}`;
    }

    if (col.primaryKey && !isIdentity) parts[0] += ' PRIMARY KEY';
    lines.push(parts[0]);
  }
  return lines;
}

function generateCreateTableMigration(model: ModelMeta, seqNum: number): string {
  const cols = columnLines(model);
  const prefix = datePrefix();
  const name = `${prefix}-${pad(seqNum)}-create-${model.tableName.toLowerCase()}`;

  return `
import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '${name}';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, nv, dt, createTable, quote } = createDialectHelpers(sequelize);

  await createTable('${model.tableName}', [
${cols.map((c) => `    '${c.replace(/'/g, "\\'")}',`).join('\n')}
  ].join(',\\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('${model.tableName}');
}
`;
}

function generateAddColumnMigration(
  tableName: string,
  col: any,
  seqNum: number,
): string {
  const prefix = datePrefix();
  const name = `${prefix}-${pad(seqNum)}-alter-${tableName.toLowerCase()}-add-${col.name.toLowerCase()}`;
  const colType = mapToHelper(col.type, '');
  const nullStr = col.allowNull ? 'true' : 'false';
  const defStr = col.defaultValue ? `'${col.defaultValue}'` : 'undefined';

  const lines = [
    `import { Sequelize } from 'sequelize';`,
    `import { createDialectHelpers } from '../migration-helper';`,
    ``,
    `export const name = '${name}';`,
    ``,
    `export async function up(sequelize: Sequelize): Promise<void> {`,
    `  const { addColumn } = createDialectHelpers(sequelize);`,
    `  await addColumn('${tableName}', '${col.name}', '${colType}', ${nullStr}, ${defStr});`,
    `}`,
    ``,
    `export async function down(sequelize: Sequelize): Promise<void> {}`,
    ``,
  ];

  return lines.join('\n');
}

function generateAlterColumnMigration(
  tableName: string,
  col: any,
  seqNum: number,
): string {
  const prefix = datePrefix();
  const name = `${prefix}-${pad(seqNum)}-alter-${tableName.toLowerCase()}-modify-${col.name.toLowerCase()}`;

  const lines = [
    `import { Sequelize } from 'sequelize';`,
    `import { createDialectHelpers } from '../migration-helper';`,
    ``,
    `export const name = '${name}';`,
    ``,
    `export async function up(sequelize: Sequelize): Promise<void> {`,
    `  const { quote, colType } = createDialectHelpers(sequelize);`,
    `  const sql = \`ALTER TABLE ${tableName} ALTER COLUMN \${quote('${col.name}')} ${mapToHelper(col.type, '')} ${col.allowNull ? 'NULL' : 'NOT NULL'}\`;`,
    `  await sequelize.query(sql, { raw: true, type: 'RAW' as any });`,
    `}`,
    ``,
    `export async function down(sequelize: Sequelize): Promise<void> {}`,
    ``,
  ];

  return lines.join('\n');
}

function generateDropColumnMigration(
  tableName: string,
  col: any,
  seqNum: number,
): string {
  const prefix = datePrefix();
  const name = `${prefix}-${pad(seqNum)}-alter-${tableName.toLowerCase()}-drop-${col.name.toLowerCase()}`;

  const lines = [
    `import { Sequelize } from 'sequelize';`,
    `import { createDialectHelpers } from '../migration-helper';`,
    ``,
    `export const name = '${name}';`,
    ``,
    `export async function up(sequelize: Sequelize): Promise<void> {`,
    `  const { quote } = createDialectHelpers(sequelize);`,
    `  await sequelize.query(\`ALTER TABLE ${tableName} DROP COLUMN \${quote('${col.name}')}\`, { raw: true, type: 'RAW' as any });`,
    `}`,
    ``,
    `export async function down(sequelize: Sequelize): Promise<void> {}`,
    ``,
  ];

  return lines.join('\n');
}

export function writeMigrations(
  migrationsDir: string,
  diff: DiffResult,
  existingCount: number,
): string[] {
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  let seq = existingCount + 1;
  const createdFiles: string[] = [];

  for (const model of diff.newTables) {
    const content = generateCreateTableMigration(model, seq);
    const fileName = `${datePrefix()}-${pad(seq)}-create-${model.tableName.toLowerCase()}.ts`;
    const filePath = path.join(migrationsDir, fileName);
    fs.writeFileSync(filePath, content.trimStart(), 'utf-8');
    createdFiles.push(fileName);
    seq++;
  }

  for (const diffCol of diff.diffColumns) {
    let content: string;
    switch (diffCol.action) {
      case 'add':
        content = generateAddColumnMigration(diffCol.tableName, diffCol.column, seq);
        break;
      case 'alter':
        content = generateAlterColumnMigration(diffCol.tableName, diffCol.column, seq);
        break;
      case 'remove':
        content = generateDropColumnMigration(diffCol.tableName, diffCol.column, seq);
        break;
    }
    const actionWord = diffCol.action === 'remove' ? 'drop' : diffCol.action === 'alter' ? 'modify' : 'add';
    const fileName = `${datePrefix()}-${pad(seq)}-alter-${diffCol.tableName.toLowerCase()}-${actionWord}-${diffCol.column.name.toLowerCase()}.ts`;
    const filePath = path.join(migrationsDir, fileName);
    fs.writeFileSync(filePath, content.trimStart(), 'utf-8');
    createdFiles.push(fileName);
    seq++;
  }

  return createdFiles;
}

export function getExistingMigrationCount(migrationsDir: string): number {
  if (!fs.existsSync(migrationsDir)) return 0;
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.ts'));
  return files.length;
}
