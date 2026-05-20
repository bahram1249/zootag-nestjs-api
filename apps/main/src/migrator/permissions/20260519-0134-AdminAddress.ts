export const name = '20260519-0134-AdminAddress';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'AdminAddress',
    groupName: 'ecommerce.admin.addresses',
    includePermissions: ['getall', 'getone', 'update'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
