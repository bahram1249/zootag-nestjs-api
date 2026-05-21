import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0245-alter-zt_devices-add-updateduserid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn('ZT_Devices', 'updatedUserId', 'BIGINT', false, undefined, fkConstraint('FK_ZT_Devices_UpdatedUserId', 'Users', 'id'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_Devices', 'updatedUserId', 'FK_ZT_Devices_UpdatedUserId');
}
