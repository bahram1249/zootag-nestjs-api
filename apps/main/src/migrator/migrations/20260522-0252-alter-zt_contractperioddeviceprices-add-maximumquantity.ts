import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name =
  '20260522-0252-alter-zt_contractperioddeviceprices-add-maximumquantity';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_ContractPeriodDevicePrices',
    'maximumQuantity',
    'INT',
    false,
    '0',
    undefined,
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_ContractPeriodDevicePrices',
    'maximumQuantity',
    undefined,
  );
}
