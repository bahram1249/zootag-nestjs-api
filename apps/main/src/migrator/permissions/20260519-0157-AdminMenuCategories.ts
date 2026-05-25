export const name = '20260519-0157-AdminMenuCategories';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'AdminMenuCategories',
    groupName: 'discountcoffe.admin.menucategories',
    findParentMenu: true,
    parentMenuName: 'کافه و رستوران',
    menuName: 'لیست دسته بندی های منو',
    menuUrl: '/discountcoffe/admin/menucategories',
    icon: 'list',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
