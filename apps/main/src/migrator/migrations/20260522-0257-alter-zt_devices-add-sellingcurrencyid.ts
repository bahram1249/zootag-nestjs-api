import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260522-0257-alter-zt_devices-add-sellingcurrencyid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_Devices',
    'sellingCurrencyId',
    'BIGINT',
    true,
    undefined,
    fkConstraint('FK_ZT_Devices_SellingCurrencyId', 'ZT_Currencies', 'id'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_Devices',
    'sellingCurrencyId',
    'FK_ZT_Devices_SellingCurrencyId',
  );
}
