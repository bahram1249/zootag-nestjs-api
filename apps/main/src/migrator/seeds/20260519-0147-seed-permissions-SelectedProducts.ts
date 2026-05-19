import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0147-seed-permissions-SelectedProducts';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'SelectedProducts',
    groupName: 'ecommerce.selectedproducts',
    findParentMenu: true,
    parentMenuName: 'محصول',
    menuName: 'دستچین کالا ها',
    menuUrl: '/admin/ecommerce/selectedProducts',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

