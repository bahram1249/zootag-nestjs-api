export const name = '20260520-0229-ZootagContractPeriodDevicePrices';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagContractPeriodDevicePrices',
    groupName: 'zootag.admin.contractperioddeviceprices',
    parentMenuName: 'قراردادها',
    menuName: 'قیمت‌های دستگاه',
    menuUrl: '/zootag/admin/contractperioddeviceprices',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
