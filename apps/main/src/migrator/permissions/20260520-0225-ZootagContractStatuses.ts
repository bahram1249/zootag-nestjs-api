export const name = '20260520-0225-ZootagContractStatuses';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagContractStatuses',
    groupName: 'zootag.admin.contractstatuses',
    parentMenuName: 'قراردادها',
    menuName: 'وضعیت قرارداد',
    menuUrl: '/zootag/admin/contractstatuses',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
