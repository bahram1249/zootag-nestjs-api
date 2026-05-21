import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0246-alter-zt_companies-modify-isdeleted';

export async function up(sequelize: Sequelize): Promise<void> {
  const { alterColumn, bit } = createDialectHelpers(sequelize);
  await sequelize.query(
    `UPDATE ZT_Companies SET isDeleted = 0 WHERE isDeleted IS NULL`,
    { raw: true, type: QueryTypes.RAW },
  );
  await sequelize.query(
    `ALTER TABLE ZT_Companies ADD CONSTRAINT DF_ZT_Companies_isDeleted DEFAULT 0 FOR isDeleted`,
    { raw: true, type: QueryTypes.RAW },
  );
  await alterColumn('ZT_Companies', 'isDeleted', bit(), false);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { alterColumn, bit } = createDialectHelpers(sequelize);
  await sequelize.query(
    `ALTER TABLE ZT_Companies DROP CONSTRAINT IF EXISTS DF_ZT_Companies_isDeleted`,
    { raw: true, type: QueryTypes.RAW },
  );
  await alterColumn('ZT_Companies', 'isDeleted', bit(), true);
}
