export const name = '20260520-0203-ZootagCurrencies';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagCurrencies',
    groupName: 'zootag.admin.currencies',
    parentMenuName: 'مدیریت',
    menuName: 'ارزها',
    menuUrl: '/zootag/admin/currencies',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
