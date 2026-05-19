import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0101-seed-permissions-Brands';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Brands',
    groupName: 'ecommerce.brands',
    findParentMenu: true,
    parentMenuName: 'محصول',
    menuName: 'برند ها',
    menuUrl: '/admin/ecommerce/brands',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

