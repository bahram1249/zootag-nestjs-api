export const name = '20260520-0230-ZootagDevices';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagDevices',
    groupName: 'zootag.admin.devices',
    parentMenuName: 'مدیریت',
    menuName: 'دستگاه‌ها',
    menuUrl: '/zootag/admin/devices',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
