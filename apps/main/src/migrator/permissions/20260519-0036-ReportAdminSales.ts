export const name = '20260519-0036-ReportAdminSales';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ReportAdminSales',
    groupName: 'ecommerce.report.adminsales',
    parentMenuName: 'گزارشات',
    menuName: 'میزان فروش و درآمد (ادمین)',
    menuUrl: '/admin/ecommerce/report/adminSales',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}