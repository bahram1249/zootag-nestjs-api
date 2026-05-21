import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name =
  '20260521-0247-alter-zt_contractperioddeviceprices-modify-isdeleted';

export async function up(sequelize: Sequelize): Promise<void> {
  const { alterColumn, bit } = createDialectHelpers(sequelize);
  await sequelize.query(
    `UPDATE ZT_ContractPeriodDevicePrices SET isDeleted = 0 WHERE isDeleted IS NULL`,
    { raw: true, type: QueryTypes.RAW },
  );
  await sequelize.query(
    `ALTER TABLE ZT_ContractPeriodDevicePrices ADD CONSTRAINT DF_ZT_ContractPeriodDevicePrices_isDeleted DEFAULT 0 FOR isDeleted`,
    { raw: true, type: QueryTypes.RAW },
  );
  await alterColumn('ZT_ContractPeriodDevicePrices', 'isDeleted', bit(), false);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { alterColumn, bit } = createDialectHelpers(sequelize);
  await sequelize.query(
    `ALTER TABLE ZT_ContractPeriodDevicePrices DROP CONSTRAINT IF EXISTS DF_ZT_ContractPeriodDevicePrices_isDeleted`,
    { raw: true, type: QueryTypes.RAW },
  );
  await alterColumn('ZT_ContractPeriodDevicePrices', 'isDeleted', bit(), true);
}
