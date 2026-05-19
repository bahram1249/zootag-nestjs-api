export const name = '20260519-0044-InventoryStatus';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'InventoryStatus',
    groupName: 'ecommerce.admin.inventorystatuses',
    includePermissions: ['getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}