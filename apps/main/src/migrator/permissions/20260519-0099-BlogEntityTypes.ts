export const name = '20260519-0099-BlogEntityTypes';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'BlogEntityTypes',
    groupName: 'eav.admin.entitytype',
    parentMenuName: 'وبلاگ',
    menuName: 'دسته بندی ها',
    menuUrl: '/admin/eav/blogEntityTypes',
    includePermissions: ['showmenu'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
