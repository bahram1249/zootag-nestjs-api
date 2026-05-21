import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260522-0259-alter-zt_contractperioddeviceprices-modify-purchaseprice';

export async function up(sequelize: Sequelize): Promise<void> {
  const { alterColumn } = createDialectHelpers(sequelize);
  await alterColumn('ZT_ContractPeriodDevicePrices', 'purchasePrice', 'DECIMAL(18, 2)', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { alterColumn } = createDialectHelpers(sequelize);
  await alterColumn('ZT_ContractPeriodDevicePrices', 'purchasePrice', 'DECIMAL', true);
}
