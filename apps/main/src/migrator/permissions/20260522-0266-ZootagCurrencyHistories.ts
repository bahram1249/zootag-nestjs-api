export const name = '20260522-0266-ZootagCurrencyHistories';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagCurrencyHistories',
    groupName: 'zootag.admin.currencyhistories',
    parentMenuName: 'مدیریت',
    menuName: 'تاریخچه ارزها',
    menuUrl: '/admin/zootag/currencyHistories',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
