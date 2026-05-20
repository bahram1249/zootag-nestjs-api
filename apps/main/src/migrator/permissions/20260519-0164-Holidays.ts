export const name = '20260519-0164-Holidays';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Holidays',
    groupName: 'discountcoffe.admin.holidays',
    findParentMenu: true,
    parentMenuName: 'کافه و رستوران',
    menuName: 'اعلام روز های تعطیل',
    menuUrl: '/discountcoffe/admin/holidays',
    includePermissions: ['showmenu'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
