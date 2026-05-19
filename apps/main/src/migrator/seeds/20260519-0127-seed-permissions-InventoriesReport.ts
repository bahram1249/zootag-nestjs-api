import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0127-seed-permissions-InventoriesReport';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'InventoriesReport',
    groupName: 'ecommerce.report.inventories',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'آمار موجودی ها',
    menuUrl: '/admin/ecommerce/report/inventories',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

