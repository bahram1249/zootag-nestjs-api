export const name = '20260519-0059-HeaderNotification';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'HeaderNotification',
    groupName: 'ecommerce.admin.headernotifications',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'اطلاع رسانی بالای سایت',
    menuUrl: '/admin/ecommerce/headerNotifications',
    includePermissions: ['showmenu', 'getall', 'update'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}