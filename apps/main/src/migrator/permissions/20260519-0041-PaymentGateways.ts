export const name = '20260519-0041-PaymentGateways';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'PaymentGateways',
    groupName: 'ecommerce.admin.paymentgateways',
    includePermissions: ['getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}