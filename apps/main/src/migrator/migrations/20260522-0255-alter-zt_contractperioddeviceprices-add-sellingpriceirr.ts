import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260522-0255-alter-zt_contractperioddeviceprices-add-sellingpriceirr';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);
  await addColumn('ZT_ContractPeriodDevicePrices', 'sellingPriceIRR', 'DECIMAL(18,2)', true, undefined, undefined);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_ContractPeriodDevicePrices', 'sellingPriceIRR', undefined);
}
