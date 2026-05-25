export const name = '20260519-0114-TotalOrders';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'TotalOrders',
    groupName: 'ecommerce.admin.totalorders',
    findParentMenu: true,
    parentMenuName: 'فروشنده',
    menuName: 'همه ی سفارشات',
    menuUrl: '/admin/ecommerce/totalOrders',
    icon: 'shopping-cart',
    includePermissions: ['showmenu', 'getall', 'getone', 'delete'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
