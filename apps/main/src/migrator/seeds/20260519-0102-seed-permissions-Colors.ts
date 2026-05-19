import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0102-seed-permissions-Colors';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Colors',
    groupName: 'ecommerce.colors',
    findParentMenu: true,
    parentMenuName: 'محصول',
    menuName: 'رنگ ها',
    menuUrl: '/admin/ecommerce/colors',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

