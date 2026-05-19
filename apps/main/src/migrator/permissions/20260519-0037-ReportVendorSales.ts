export const name = '20260519-0037-ReportVendorSales';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ReportVendorSales',
    groupName: 'ecommerce.report.vendorsales',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'میزان فروش و درآمد (فروشنده)',
    menuUrl: '/admin/ecommerce/report/vendorSales',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}