import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0248-alter-zt_contractperiods-modify-isdeleted';

export async function up(sequelize: Sequelize): Promise<void> {
  const { alterColumn, bit } = createDialectHelpers(sequelize);
  await sequelize.query(
    `UPDATE ZT_ContractPeriods SET isDeleted = 0 WHERE isDeleted IS NULL`,
    { raw: true, type: QueryTypes.RAW },
  );
  await sequelize.query(
    `ALTER TABLE ZT_ContractPeriods ADD CONSTRAINT DF_ZT_ContractPeriods_isDeleted DEFAULT 0 FOR isDeleted`,
    { raw: true, type: QueryTypes.RAW },
  );
  await alterColumn('ZT_ContractPeriods', 'isDeleted', bit(), false);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { alterColumn, bit } = createDialectHelpers(sequelize);
  await sequelize.query(
    `ALTER TABLE ZT_ContractPeriods DROP CONSTRAINT IF EXISTS DF_ZT_ContractPeriods_isDeleted`,
    { raw: true, type: QueryTypes.RAW },
  );
  await alterColumn('ZT_ContractPeriods', 'isDeleted', bit(), true);
}
