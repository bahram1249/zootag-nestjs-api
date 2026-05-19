import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0146-seed-permissions-FactorDiscounts';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'FactorDiscounts',
    groupName: 'ecommerce.admin.factordiscounts',
    findParentMenu: true,
    parentMenuName: 'محصول',
    menuName: 'تخفیف ارسال رایگان',
    menuUrl: '/admin/ecommerce/factorDiscounts',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

