export const name = '20260519-0189-GsGuaranteeActivityReports';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeActivityReports',
    groupName: 'gs.report.activityreports',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'گزارش فعالیت ها',
    menuUrl: '/admin/gs/activityReports',
    icon: 'activity',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
