import { QueryTypes, Sequelize } from 'sequelize';
import { createAdapters, Dialect } from './dialect-adapters';

export function createDialectHelpers(sequelize: Sequelize) {
  const rawDialect = sequelize.getDialect();
  const d = (typeof rawDialect === 'string' ? rawDialect : String(rawDialect))
    .trim()
    .toLowerCase() as Dialect;
  const a = createAdapters(d);

  return {
    dialect: d,
    colType: a.colType,
    quote: a.quote,
    idCol: a.idCol,
    pk: a.pk,
    ref: a.ref,
    ns: a.ns,
    nowVal: a.now(),
    dt: () => a.colType('DATETIMEOFFSET') + ' NOT NULL',
    nv: (len: string) => a.colType(`NVARCHAR(${len})`),
    bit: () => a.colType('BIT'),
    text: () => a.colType('NTEXT'),
    top: a.top,

    createTable: async (
      tableName: string,
      columns: string,
      ifNotExists = true,
    ): Promise<void> => {
      const sql = a.createTableSql(
        tableName,
        a.bracketSql(columns),
        ifNotExists,
      );
      await sequelize.query(sql, { raw: true, type: QueryTypes.RAW });
    },

    dropTables: async (...tables: string[]): Promise<void> => {
      for (const t of tables) {
        await sequelize.query(a.dropTableSql(t), {
          raw: true,
          type: QueryTypes.RAW,
        });
      }
    },

    addColumn: async (
      table: string,
      column: string,
      colTypeStr: string,
      nullable = true,
      defaultValue?: string,
      constraint?: string,
    ): Promise<void> => {
      const sql = a.addColumnSql(
        table,
        column,
        colTypeStr,
        nullable,
        defaultValue,
        constraint,
      );
      await sequelize.query(sql, { raw: true, type: QueryTypes.RAW });
    },

    fkConstraint: (name: string, table: string, column: string): string =>
      a.fkConstraint(name, table, column),

    alterColumn: async (
      table: string,
      column: string,
      colTypeStr: string,
      nullable: boolean,
    ): Promise<void> => {
      const sql = a.alterColumnSql(table, column, colTypeStr, nullable);
      await sequelize.query(sql, { raw: true, type: QueryTypes.RAW });
    },

    dropColumn: async (
      tableName: string,
      columnName: string,
      constraintName?: string,
    ): Promise<void> => {
      if (constraintName && d === 'mssql') {
        await sequelize.query(
          `ALTER TABLE ${tableName} DROP CONSTRAINT ${constraintName}`,
          { raw: true, type: QueryTypes.RAW },
        );
      }
      const q = a.quote(columnName);
      await sequelize.query(`ALTER TABLE ${tableName} DROP COLUMN ${q}`, {
        raw: true,
        type: QueryTypes.RAW,
      });
    },

    executeRaw: async (sql: string): Promise<void> => {
      await sequelize.query(a.executeRawSql(sql), {
        raw: true,
        type: QueryTypes.RAW,
      });
    },

    checkSetting: async (
      key: string,
      values: string[],
      settingValue?: string,
    ): Promise<boolean> => {
      const quotedKey = a.quote(key);
      const valueList = values.map((v) => `'${v}'`).join(', ');
      const valueClause =
        settingValue !== undefined
          ? ` AND ${a.quote('value')} = '${settingValue}'`
          : '';
      const sql =
        d === 'mssql'
          ? `SELECT 1 FROM Settings WHERE ${quotedKey} IN (${valueList})${valueClause}`
          : `SELECT 1 FROM Settings WHERE ${quotedKey} IN (${valueList})${valueClause} LIMIT 1`;
      try {
        const [result]: any = await sequelize.query(sql, {
          raw: true,
          type: QueryTypes.SELECT,
        });
        return !!result;
      } catch {
        return false;
      }
    },
  };
}
