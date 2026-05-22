import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0026-settings-insert-sitename-customername';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, top, quote, ns } = createDialectHelpers(sequelize);

  const [existing]: any = await sequelize.query(
    top(1, `SELECT 1 FROM Settings WHERE ${quote('key')} = 'SITE_NAME'`),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!existing) {
    await sequelize.query(
      `INSERT INTO Settings (${quote('key')}, ${quote('value')}, ${quote('type')}, ${quote('createdAt')}, ${quote('updatedAt')})
       VALUES (${ns('SITE_NAME')}, ${ns(process.env.PROJECT_NAME || 'Zootag')}, ${ns('string')}, ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
    await sequelize.query(
      `INSERT INTO Settings (${quote('key')}, ${quote('value')}, ${quote('type')}, ${quote('createdAt')}, ${quote('updatedAt')})
       VALUES (${ns('CUSTOMER_NAME')}, ${ns(process.env.PROJECT_NAME || 'Zootag')}, ${ns('string')}, ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { quote } = createDialectHelpers(sequelize);

  await sequelize.query(
    `DELETE FROM Settings WHERE ${quote('key')} IN ('SITE_NAME', 'CUSTOMER_NAME')`,
    { raw: true, type: QueryTypes.RAW },
  );
}
