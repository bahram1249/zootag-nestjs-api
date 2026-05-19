import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0181-seed-permissions-GsGuaranteeSuperVisors';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeSuperVisors',
    groupName: 'gs.admin.supervisorusers',
    findParentMenu: true,
    parentMenuName: 'عملیات',
    menuName: 'ناظر ها',
    menuUrl: '/admin/gs/superVisorUsers',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
