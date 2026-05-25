export const name = '20260519-0118-DeliveryOrders';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'DeliveryOrders',
    groupName: 'ecommerce.admin.deliveryorders',
    parentMenuName: 'پیک',
    parentIcon: 'truck',
    menuName: 'سفارشات منتظر ارسال به مشتری',
    menuUrl: '/admin/ecommerce/deliveryOrders',
    icon: 'circle',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
