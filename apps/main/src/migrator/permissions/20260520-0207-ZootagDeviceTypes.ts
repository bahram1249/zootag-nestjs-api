export const name = '20260520-0207-ZootagDeviceTypes';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagDeviceTypes',
    groupName: 'zootag.admin.devicetypes',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه',
    menuName: 'انواع دستگاه',
    menuUrl: '/admin/zootag/devicetypes',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
