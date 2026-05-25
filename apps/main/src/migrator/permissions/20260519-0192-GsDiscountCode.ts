export const name = '20260519-0192-GsDiscountCode';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'DiscountCode',
    groupName: 'gs.admin.discountcodes',
    parentMenuName: 'تخفیف',
    parentIcon: 'tag',
    menuName: 'کدهای تخفیف',
    menuUrl: '/admin/gs/discountCodes',
    icon: 'tag',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
