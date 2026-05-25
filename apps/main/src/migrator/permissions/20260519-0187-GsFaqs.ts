export const name = '20260519-0187-GsFaqs';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Faqs',
    groupName: 'gs.admin.faqs',
    findParentMenu: true,
    parentMenuName: 'مدیریت',
    menuName: 'سوالات متداول',
    menuUrl: '/admin/gs/faqs',
    icon: 'help-circle',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
