export const name = '20260519-0139-HomePages';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'HomePages',
    groupName: 'ecommerce.admin.homepages',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'تنظیمات صفحه اصلی',
    menuUrl: '/admin/ecommerce/homePages',
    icon: 'home',
    includePermissions: ['showmenu', 'getall', 'create'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
