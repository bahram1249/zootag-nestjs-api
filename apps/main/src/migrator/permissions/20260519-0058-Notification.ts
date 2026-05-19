export const name = '20260519-0058-Notification';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Notification',
    groupName: 'ecommerce.admin.notifications',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'اطلاع رسانی',
    menuUrl: '/admin/ecommerce/notifications',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
