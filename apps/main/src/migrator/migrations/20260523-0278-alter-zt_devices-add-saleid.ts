import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0278-alter-zt_devices-add-saleid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_Devices',
    'saleId',
    'BIGINT',
    true,
    undefined,
    fkConstraint('FK_ZT_Devices_SaleId', 'ZT_DeviceSales', 'id'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_Devices', 'saleId', 'FK_ZT_Devices_SaleId');
}
