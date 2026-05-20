export const name = '20260519-0168-GsProductTypes';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ProductTypes',
    groupName: 'gs.admin.producttypes',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه گارانتی',
    menuName: 'انواع محصول',
    menuUrl: '/admin/gs/productTypes',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
