export const name = '20260519-0138-CancellOrders';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'CancellOrders',
    groupName: 'ecommerce.admin.cancellorders',
    findParentMenu: true,
    parentMenuName: 'فروشنده',
    menuName: 'سفارشات کنسل شده',
    menuUrl: '/admin/ecommerce/cancellOrders',
    icon: 'x-circle',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
