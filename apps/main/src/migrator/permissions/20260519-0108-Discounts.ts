export const name = '20260519-0108-Discounts';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Discounts',
    groupName: 'ecommerce.admin.discounts',
    findParentMenu: true,
    parentMenuName: 'محصول',
    menuName: 'تخفیفات',
    menuUrl: '/admin/ecommerce/discounts',
    icon: 'percent',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
