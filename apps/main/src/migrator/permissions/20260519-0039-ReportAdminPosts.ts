export const name = '20260519-0039-ReportAdminPosts';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ReportAdminPosts',
    groupName: 'ecommerce.report.adminposts',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'سفارشات پستی(ادمین)',
    menuUrl: '/admin/ecommerce/report/adminPosts',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}