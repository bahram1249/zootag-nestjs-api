export const name = '20260524-0294-ZootagMarketers';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagMarketers',
    groupName: 'zootag.admin.marketers',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه',
    menuName: 'بازاریاب‌ها',
    menuUrl: '/admin/zootag/marketers',
    icon: 'users',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
