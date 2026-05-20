export const name = '20260520-0209-ZootagDeviceStatuses';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagDeviceStatuses',
    groupName: 'zootag.admin.devicestatuses',
    parentMenuName: 'مدیریت',
    menuName: 'وضعیت دستگاه',
    menuUrl: '/zootag/admin/devicestatuses',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
