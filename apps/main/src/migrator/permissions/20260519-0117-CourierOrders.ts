export const name = '20260519-0117-CourierOrders';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'CourierOrders',
    groupName: 'ecommerce.admin.courierorders',
    findParentMenu: true,
    parentMenuName: 'فروشنده',
    menuName: 'سفارشات منتظر ارسال به پیک',
    menuUrl: '/admin/ecommerce/courierOrders',
    icon: 'truck',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
