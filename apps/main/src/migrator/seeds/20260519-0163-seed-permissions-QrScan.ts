import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0163-seed-permissions-QrScan';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'QrScan',
    groupName: 'discountcoffe.admin.qrscan',
    findParentMenu: true,
    parentMenuName: 'کافه و رستوران',
    menuName: 'اسکن بارکد',
    menuUrl: '/discountcoffe/admin/qrscan',
    includePermissions: ['showmenu'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
