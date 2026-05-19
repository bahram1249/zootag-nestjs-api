import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0157-seed-permissions-AdminMenuCategories';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'AdminMenuCategories',
    groupName: 'discountcoffe.admin.menucategories',
    findParentMenu: true,
    parentMenuName: 'کافه و رستوران',
    menuName: 'لیست دسته بندی های منو',
    menuUrl: '/discountcoffe/admin/menucategories',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
