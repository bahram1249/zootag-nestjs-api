export const name = '20260520-0207-ZootagDeviceTypes';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagDeviceTypes',
    groupName: 'zootag.admin.devicetypes',
    parentMenuName: 'مدیریت',
    menuName: 'انواع دستگاه',
    menuUrl: '/zootag/admin/devicetypes',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
