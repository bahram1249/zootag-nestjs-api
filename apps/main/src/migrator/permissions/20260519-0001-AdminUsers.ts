export const name = '20260519-0001-AdminUsers';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'AdminUsers',
    groupName: 'core.admin.users',
    parentMenuName: 'مدیریت',
    menuName: 'کاربران',
    menuUrl: '/core/admin/users',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
