import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name =
  '20260522-0254-alter-zt_contractperioddeviceprices-add-sellingcurrencyid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_ContractPeriodDevicePrices',
    'sellingCurrencyId',
    'BIGINT',
    true,
    undefined,
    fkConstraint(
      'FK_ZT_ContractPeriodDevicePrices_SellingCurrencyId',
      'ZT_Currencies',
      'id',
    ),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_ContractPeriodDevicePrices',
    'sellingCurrencyId',
    'FK_ZT_ContractPeriodDevicePrices_SellingCurrencyId',
  );
}
