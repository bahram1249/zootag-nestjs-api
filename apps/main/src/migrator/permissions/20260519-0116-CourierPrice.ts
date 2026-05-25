export const name = '20260519-0116-CourierPrice';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'CourierPrice',
    groupName: 'ecommerce.admin.courierprices',
    findParentMenu: true,
    parentMenuName: 'پرداخت و حمل و نقل',
    menuName: 'نرخ پیک',
    menuUrl: '/admin/ecommerce/courierPrices',
    icon: 'dollar-sign',
    includePermissions: ['showmenu', 'getone', 'update'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
