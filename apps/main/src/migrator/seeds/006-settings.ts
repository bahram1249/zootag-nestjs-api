import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '050-settings';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, top } = createDialectHelpers(sequelize);
  const [existing]: any = await sequelize.query(
    top(1, `SELECT 1 FROM Settings WHERE "key" = 'SITE_NAME'`),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!existing) {
    await sequelize.query(
      `INSERT INTO Settings ("key", "value", "type", "createdAt", "updatedAt")
       VALUES ('SITE_NAME', 'ecommerce', 'string', ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
    await sequelize.query(
      `INSERT INTO Settings ("key", "value", "type", "createdAt", "updatedAt")
       VALUES ('CUSTOMER_NAME', 'jahizan', 'string', ${nowVal}, ${nowVal})`,
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
