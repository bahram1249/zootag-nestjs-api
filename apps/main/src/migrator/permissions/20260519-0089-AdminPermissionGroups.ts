export const name = '20260519-0089-AdminPermissionGroups';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'AdminPermissionGroups',
    groupName: 'core.admin.permissiongroups',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'گروه دسترسی',
    menuUrl: '/admin/core/permissionGroups',
    includePermissions: ['showmenu', 'getall', 'getone', 'create', 'update'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
