export const name = '20260519-0156-AdminBuffets';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'AdminBuffets',
    groupName: 'discountcoffe.admin.buffets',
    parentMenuName: 'کافه و رستوران',
    menuName: 'لیست کافه و رستوران',
    menuUrl: '/discountcoffe/admin/buffets',
    includePermissions: [
      'showmenu',
      'getall',
      'getone',
      'create',
      'update',
      'delete',
      'menu',
    ],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
