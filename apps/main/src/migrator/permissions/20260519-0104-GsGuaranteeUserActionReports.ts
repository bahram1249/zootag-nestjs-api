export const name = '20260519-0104-GsGuaranteeUserActionReports';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeUserActionReports',
    groupName: 'gs.report.useractionreports',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'گزارش عملکرد کاربران',
    menuUrl: '/admin/gs/userActionReports',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
