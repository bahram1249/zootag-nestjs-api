export const name = '20260519-0185-GsGuaranteeIncomeReports';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeIncomeReports',
    groupName: 'gs.report.incomereports',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'گزارش درآمدی',
    menuUrl: '/admin/gs/incomeReports',
    icon: 'trending-up',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
