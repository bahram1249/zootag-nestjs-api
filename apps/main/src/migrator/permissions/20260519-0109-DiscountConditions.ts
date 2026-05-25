export const name = '20260519-0109-DiscountConditions';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'DiscountConditions',
    groupName: 'ecommerce.admin.discountconditions',
    findParentMenu: true,
    parentMenuName: 'محصول',
    menuName: 'شرط تخفیف',
    menuUrl: '/admin/ecommerce/discounts',
    icon: 'filter',
    includePermissions: ['getall', 'getone', 'create', 'delete'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
