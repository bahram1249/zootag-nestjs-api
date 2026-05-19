export const name = '20260519-0060-GoldCurrentPrices';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GoldCurrentPrices',
    groupName: 'ecommerce.admin.currentprices',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'تنظیمات قیمت لحظه ای',
    menuUrl: '/admin/ecommerce/goldCurrentPrices',
    includePermissions: ['showmenu', 'getall', 'update'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}