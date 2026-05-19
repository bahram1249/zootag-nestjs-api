export const name = '20260519-0067-Logistic';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Logistic',
    groupName: 'ecommerce.logistics',
    findParentMenu: true,
    parentMenuName: 'پرداخت و حمل و نقل',
    menuName: 'لاجستیک',
    menuUrl: '/admin/ecommerce/logistics',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}