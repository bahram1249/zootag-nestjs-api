import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0190-seed-permissions-GsGuaranteeSupplierReports';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeSupplierReports',
    groupName: 'gs.report.supplierreports',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'گزارش تامین کنندگان',
    menuUrl: '/admin/gs/supplierReports',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
