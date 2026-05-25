export const name = '20260519-0181-GsGuaranteeSuperVisors';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeSuperVisors',
    groupName: 'gs.admin.supervisorusers',
    findParentMenu: true,
    parentMenuName: 'عملیات',
    menuName: 'ناظر ها',
    menuUrl: '/admin/gs/superVisorUsers',
    icon: 'eye',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
