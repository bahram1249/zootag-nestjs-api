export const name = '20260519-0110-Transactions';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Transactions',
    groupName: 'ecommerce.admin.transactions',
    parentMenuName: 'پرداخت و حمل و نقل',
    parentIcon: 'credit-card',
    menuName: 'تراکنش ها',
    menuUrl: '/admin/ecommerce/transactions',
    icon: 'credit-card',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
