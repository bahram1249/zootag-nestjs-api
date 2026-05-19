export const name = '20260519-0010-EntityModels';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {

  await createCrudPermissions(sequelize, {
    entityName: 'EntityModels',
    groupName: 'eav.admin.entitymodel',
    includePermissions: ['getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}