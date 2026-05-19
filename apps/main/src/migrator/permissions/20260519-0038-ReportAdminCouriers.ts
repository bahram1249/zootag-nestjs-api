export const name = '20260519-0038-ReportAdminCouriers';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ReportAdminCouriers',
    groupName: 'ecommerce.report.admincouriers',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'سفارشات پیکی(ادمین)',
    menuUrl: '/admin/ecommerce/report/adminCouriers',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
