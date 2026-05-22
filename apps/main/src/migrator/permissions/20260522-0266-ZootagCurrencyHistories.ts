export const name = '20260522-0266-ZootagCurrencyHistories';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (!(await checkSetting('key', ['SITE_NAME']))) return;
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagCurrencyHistories',
    groupName: 'zootag.admin.currencyhistories',
    parentMenuName: 'مدیریت',
    menuName: 'تاریخچه ارزها',
    menuUrl: '/zootag/admin/currencyHistories',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
