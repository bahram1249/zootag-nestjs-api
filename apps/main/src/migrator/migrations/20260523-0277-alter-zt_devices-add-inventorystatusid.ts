import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0277-alter-zt_devices-add-inventorystatusid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_Devices',
    'inventoryStatusId',
    'BIGINT',
    false,
    undefined,
    fkConstraint(
      'FK_ZT_Devices_InventoryStatusId',
      'ZT_InventoryStatuses',
      'id',
    ),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_Devices',
    'inventoryStatusId',
    'FK_ZT_Devices_InventoryStatusId',
  );
}
