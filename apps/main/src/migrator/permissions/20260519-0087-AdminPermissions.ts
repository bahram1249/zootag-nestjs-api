export const name = '20260519-0087-AdminPermissions';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'AdminPermissions',
    groupName: 'core.admin.permissions',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'نمایش دسترسی ها',
    menuUrl: '/admin/core/permissions',
    icon: 'lock',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
