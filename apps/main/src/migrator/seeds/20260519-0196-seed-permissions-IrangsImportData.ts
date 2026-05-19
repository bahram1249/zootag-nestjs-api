import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0196-seed-permissions-IrangsImportData';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'IrangsImportData',
    groupName: 'guarantee.admin.irangs-import-data',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه گارانتی',
    menuName: 'ورود اطلاعات ایران جی اس',
    menuUrl: '/admin/gs/irangs-import-data',
    includePermissions: ['showmenu', 'getall', 'create'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
