import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260529-0321-alter-zt_pets-add-deviceid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn('ZT_Pets', 'deviceId', 'BIGINT', true, undefined, fkConstraint('FK_ZT_Pets_DeviceId', 'ZT_Devices', 'id'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_Pets', 'deviceId', 'FK_ZT_Pets_DeviceId');
}
