export const name = '20260519-0028-PendingOrders';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'PendingOrders',
    groupName: 'ecommerce.admin.pendingorders',
    findParentMenu: true,
    parentMenuName: 'فروشنده',
    menuName: 'سفارشات منتظر پردازش',
    menuUrl: '/admin/ecommerce/pendingOrders',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
