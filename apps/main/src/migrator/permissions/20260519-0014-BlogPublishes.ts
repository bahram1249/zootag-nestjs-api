export const name = '20260519-0014-BlogPublishes';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {

  await createCrudPermissions(sequelize, {
    entityName: 'BlogPublishes',
    groupName: 'eav.admin.blogpublishes',
    includePermissions: ['getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}