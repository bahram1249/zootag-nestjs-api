export const name = '20260519-0100-Posts';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Posts',
    groupName: 'eav.admin.posts',
    findParentMenu: true,
    parentMenuName: 'وبلاگ',
    menuName: 'مطالب',
    menuUrl: '/admin/eav/posts',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
