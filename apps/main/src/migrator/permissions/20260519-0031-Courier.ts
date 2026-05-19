export const name = '20260519-0031-Courier';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Courier',
    groupName: 'ecommerce.admin.couriers',
    findParentMenu: true,
    parentMenuName: 'پرداخت و حمل و نقل',
    menuName: 'پیک ها',
    menuUrl: '/admin/ecommerce/couriers',
    includePermissions: ['showmenu', 'getall', 'getone', 'create', 'delete'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}