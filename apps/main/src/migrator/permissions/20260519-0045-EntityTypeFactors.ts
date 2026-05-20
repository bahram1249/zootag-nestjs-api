export const name = '20260519-0045-EntityTypeFactors';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'EntityTypeFactors',
    groupName: 'ecommerce.admin.entitytypefactors',
    includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
