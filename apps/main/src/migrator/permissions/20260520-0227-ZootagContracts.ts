export const name = '20260520-0227-ZootagContracts';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagContracts',
    groupName: 'zootag.admin.contracts',
    parentMenuName: 'مدیریت',
    menuName: 'قراردادها',
    menuUrl: '/zootag/admin/contracts',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
