import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name =
  '20260524-0289-alter-zt_contractperioddeviceprices-drop-sellingprice';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_ContractPeriodDevicePrices', 'sellingPrice', undefined);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_ContractPeriodDevicePrices',
    'sellingPrice',
    'DECIMAL(18, 2)',
    true,
    undefined,
    undefined,
  );
}
