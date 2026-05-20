export const name = '20260520-0228-ZootagContractPeriods';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagContractPeriods',
    groupName: 'zootag.admin.contractperiods',
    parentMenuName: 'قراردادها',
    menuName: 'دوره‌های قرارداد',
    menuUrl: '/zootag/admin/contractperiods',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
