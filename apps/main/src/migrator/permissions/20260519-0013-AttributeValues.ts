export const name = '20260519-0013-AttributeValues';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {

  await createCrudPermissions(sequelize, {
    entityName: 'AttributeValues',
    groupName: 'eav.admin.attributevalue',
    includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}