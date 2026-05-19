import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0187-seed-permissions-GsFaqs';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Faqs',
    groupName: 'gs.admin.faqs',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'سوالات متداول',
    menuUrl: '/admin/gs/faqs',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
