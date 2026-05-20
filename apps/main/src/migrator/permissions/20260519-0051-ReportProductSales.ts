export const name = '20260519-0051-ReportProductSales';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ReportProductSales',
    groupName: 'ecommerce.report.productsales',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'گزارش تعداد فروش کالا',
    menuUrl: '/admin/ecommerce/report/productSales',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
