import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0280-alter-zt_devices-drop-sellingcurrencyid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_Devices',
    'sellingCurrencyId',
    'FK_ZT_Devices_SellingCurrencyId',
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_Devices',
    'sellingCurrencyId',
    'BIGINT',
    true,
    undefined,
    undefined,
  );
}
