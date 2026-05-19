export const name = '20260519-0002-AdminRoles';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!await checkSetting('key', ['SITE_NAME'])) return;
  await createCrudPermissions(sequelize, {
    entityName: 'AdminRoles',
    groupName: 'core.admin.roles',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'مدیریت نقش ها',
    menuUrl: '/core/admin/roles',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}