import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0124-seed-permissions-ReportCouriers';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ReportCouriers',
    groupName: 'ecommerce.report.couriers',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'سفارشات پیکی',
    menuUrl: '/admin/ecommerce/report/couriers',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

