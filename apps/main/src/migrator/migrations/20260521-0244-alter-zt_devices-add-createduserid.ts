import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0244-alter-zt_devices-add-createduserid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn('ZT_Devices', 'createdUserId', 'BIGINT', false, undefined, fkConstraint('FK_ZT_Devices_CreatedUserId', 'Users', 'id'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_Devices', 'createdUserId', 'FK_ZT_Devices_CreatedUserId');
}
