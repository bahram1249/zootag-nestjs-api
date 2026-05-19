export const name = '20260519-0027-PostageFees';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'PostageFees',
    groupName: 'ecommerce.admin.postagefees',
    findParentMenu: true,
    parentMenuName: 'پرداخت و حمل و نقل',
    menuName: 'نرخ پستی',
    menuUrl: '/admin/ecommerce/postageFees',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
