export const name = '20260519-0107-GsGuaranteeTechnicalPersonReports';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeTechnicalPersonReports',
    groupName: 'gs.report.technicalpersonreports',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'گزارش افراد فنی',
    menuUrl: '/admin/gs/technicalPersonReports',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}