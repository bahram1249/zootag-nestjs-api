import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0126-seed-permissions-PaymentTransactions';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'PaymentTransactions',
    groupName: 'ecommerce.report.paymenttransactions',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'کمیسیون درگاه',
    menuUrl: '/admin/ecommerce/report/paymentTransactions',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

