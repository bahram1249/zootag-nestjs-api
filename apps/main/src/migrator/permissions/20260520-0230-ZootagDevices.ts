export const name = '20260520-0230-ZootagDevices';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagDevices',
    groupName: 'zootag.admin.devices',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه',
    menuName: 'دستگاه‌ها',
    menuUrl: '/admin/zootag/devices',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
