export const name = '20260519-0021-Vendors';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Vendors',
    groupName: 'ecommerce.vendors',
    findParentMenu: true,
    parentMenuName: 'محصول',
    menuName: 'فروشندگان',
    menuUrl: '/admin/ecommerce/vendors',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
