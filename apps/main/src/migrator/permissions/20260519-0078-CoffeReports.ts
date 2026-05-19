export const name = '20260519-0078-CoffeReports';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'CoffeReports',
    groupName: 'discountcoffe.admin.coffereports',
    findParentMenu: true,
    parentMenuName: 'کافه و رستوران',
    menuName: 'گزارش های کافه',
    menuUrl: '/discountcoffe/admin/coffereports',
    includePermissions: ['showmenu', 'getall', 'getone', 'update'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}