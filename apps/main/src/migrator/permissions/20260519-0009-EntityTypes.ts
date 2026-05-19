export const name = '20260519-0009-EntityTypes';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {

  await createCrudPermissions(sequelize, {
    entityName: 'EntityTypes',
    groupName: 'eav.admin.entitytype',
    parentMenuName: 'محصول',
    menuName: 'دسته بندی ها',
    menuUrl: '/admin/eav/entityTypes',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}