export const name = '20260519-0107-Products';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Products',
    groupName: 'ecommerce.admin.products',
    findParentMenu: true,
    parentMenuName: 'محصول',
    menuName: 'محصولات',
    menuUrl: '/admin/ecommerce/products',
    icon: 'package',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
