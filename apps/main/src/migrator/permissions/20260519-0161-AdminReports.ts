export const name = '20260519-0161-AdminReports';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'AdminReports',
    groupName: 'discountcoffe.admin.adminreports',
    findParentMenu: true,
    parentMenuName: 'کافه و رستوران',
    menuName: 'گزارش های ادمین',
    menuUrl: '/discountcoffe/admin/adminreports',
    icon: 'bar-chart',
    includePermissions: ['showmenu', 'getall', 'getone', 'update'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
