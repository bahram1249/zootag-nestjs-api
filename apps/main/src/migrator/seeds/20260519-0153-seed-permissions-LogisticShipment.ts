import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0153-seed-permissions-LogisticShipment';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'LogisticShipment',
    groupName: 'ecommerce.logisticshipmentways',
    includePermissions: ['getall', 'create'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

