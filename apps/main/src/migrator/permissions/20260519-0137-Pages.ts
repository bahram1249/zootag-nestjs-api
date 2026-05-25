export const name = '20260519-0137-Pages';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Pages',
    groupName: 'ecommerce.admin.pages',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'صفحات',
    menuUrl: '/admin/ecommerce/pages',
    icon: 'file-text',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
