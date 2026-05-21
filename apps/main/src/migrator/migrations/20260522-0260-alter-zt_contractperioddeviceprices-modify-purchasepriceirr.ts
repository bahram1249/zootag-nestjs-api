import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260522-0260-alter-zt_contractperioddeviceprices-modify-purchasepriceirr';

export async function up(sequelize: Sequelize): Promise<void> {
  const { alterColumn } = createDialectHelpers(sequelize);
  await alterColumn('ZT_ContractPeriodDevicePrices', 'purchasePriceIRR', 'DECIMAL(18, 2)', false);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { alterColumn } = createDialectHelpers(sequelize);
  await alterColumn('ZT_ContractPeriodDevicePrices', 'purchasePriceIRR', 'DECIMAL', false);
}
