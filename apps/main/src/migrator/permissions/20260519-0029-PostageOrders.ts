export const name = '20260519-0029-PostageOrders';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'PostageOrders',
    groupName: 'ecommerce.admin.postageorders',
    findParentMenu: true,
    parentMenuName: 'فروشنده',
    menuName: 'سفارشات منتظر ارسال به پست',
    menuUrl: '/admin/ecommerce/postageOrders',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
