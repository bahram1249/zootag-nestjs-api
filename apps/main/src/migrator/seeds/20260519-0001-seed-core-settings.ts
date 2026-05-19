import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0001-seed-core-settings';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top, checkSetting } = createDialectHelpers(sequelize);

  const hasSiteName = await checkSetting('key', ['SITE_NAME']);
  if (hasSiteName) return;

  const [existing]: any = await sequelize.query(
    top(1, `SELECT 1 FROM Settings WHERE "key" = 'SITE_NAME'`),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!existing) {
    await sequelize.query(
      `INSERT INTO Settings ("key", "value", "type", "createdAt", "updatedAt")
       VALUES (${ns('SITE_NAME')}, ${ns(process.env.PROJECT_NAME || 'zootag')}, ${ns('string')}, ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
    await sequelize.query(
      `INSERT INTO Settings ("key", "value", "type", "createdAt", "updatedAt")
       VALUES (${ns('CUSTOMER_NAME')}, ${ns(process.env.SITE_NAME || 'zootag')}, ${ns('string')}, ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(
    `DELETE FROM Settings WHERE "key" IN ('SITE_NAME', 'CUSTOMER_NAME')`,
    { raw: true, type: QueryTypes.RAW },
  );
}