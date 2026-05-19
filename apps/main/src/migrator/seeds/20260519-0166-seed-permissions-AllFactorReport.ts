import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0166-seed-permissions-AllFactorReport';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'FactorReport',
    groupName: 'discountcoffe.admin.allfactorreport',
    findParentMenu: true,
    parentMenuName: 'کافه و رستوران',
    menuName: 'صورت حساب ها',
    menuUrl: '/discountcoffe/admin/allFactorReport',
    includePermissions: ['showmenu'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
