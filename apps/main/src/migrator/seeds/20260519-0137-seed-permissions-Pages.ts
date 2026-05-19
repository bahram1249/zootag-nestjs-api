import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0137-seed-permissions-Pages';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Pages',
    groupName: 'ecommerce.admin.pages',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'صفحات',
    menuUrl: '/admin/ecommerce/pages',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

