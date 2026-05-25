export const name = '20260519-0088-AdminMenus';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'AdminMenus',
    groupName: 'core.admin.menus',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'منو ها',
    menuUrl: '/admin/core/menus',
    icon: 'menu',
    includePermissions: ['showmenu', 'getall', 'getone', 'create', 'update'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
