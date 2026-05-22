export const name = '20260520-0209-ZootagDeviceStatuses';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagDeviceStatuses',
    groupName: 'zootag.admin.devicestatuses',
    parentMenuName: 'مدیریت',
    menuName: 'وضعیت دستگاه',
    menuUrl: '/admin/zootag/devicestatuses',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
