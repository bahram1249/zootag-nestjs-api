import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '006-settings-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, top, quote } = createDialectHelpers(sequelize);

  const [existing]: any = await sequelize.query(
    top(1, `SELECT 1 FROM Settings WHERE ${quote('key')} = 'SITE_NAME'`),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!existing) {
    await sequelize.query(
      `INSERT INTO Settings (${quote('key')}, ${quote('value')}, ${quote('type')}, ${quote('createdAt')}, ${quote('updatedAt')})
       VALUES ('SITE_NAME', 'ecommerce', 'string', ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
    await sequelize.query(
      `INSERT INTO Settings (${quote('key')}, ${quote('value')}, ${quote('type')}, ${quote('createdAt')}, ${quote('updatedAt')})
       VALUES ('CUSTOMER_NAME', 'jahizan', 'string', ${nowVal}, ${nowVal})`,
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
