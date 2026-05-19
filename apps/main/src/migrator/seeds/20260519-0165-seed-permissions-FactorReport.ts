import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0165-seed-permissions-FactorReport';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'FactorReport',
    groupName: 'discountcoffe.admin.factorreport',
    findParentMenu: true,
    parentMenuName: 'کافه و رستوران',
    menuName: 'صورت حساب',
    menuUrl: '/discountcoffe/admin/factorReport',
    includePermissions: ['showmenu'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
