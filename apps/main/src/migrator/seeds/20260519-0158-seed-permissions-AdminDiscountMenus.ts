import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0158-seed-permissions-AdminDiscountMenus';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'AdminDiscountMenus',
    groupName: 'discountcoffe.admin.menus',
    includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
