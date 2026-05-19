import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0149-seed-permissions-LinkedEntityTypeBrand';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'LinkedEntityTypeBrand',
    groupName: 'ecommerce.admin.linkedentitytypebrands',
    findParentMenu: true,
    parentMenuName: 'محصول',
    menuName: 'صفحه ساز دسته بندی و برندها',
    menuUrl: '/admin/ecommerce/linkedEntityTypeBrands',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

