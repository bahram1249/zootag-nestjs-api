export const name = '20260519-0048-OrderStatus';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'OrderStatus',
    groupName: 'ecommerce.admin.orderstatuses',
    includePermissions: ['getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}