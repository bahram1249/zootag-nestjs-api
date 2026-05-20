export const name = '20260519-0064-SelectedProductItems';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'SelectedProductItems',
    groupName: 'ecommerce.selectedproductsitems',
    includePermissions: ['getall', 'create', 'delete'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
