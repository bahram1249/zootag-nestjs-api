export const name = '20260519-0052-InventoryHistories';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'InventoryHistories',
    groupName: 'ecommerce.admin.inventoryhistories',
    includePermissions: ['getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}