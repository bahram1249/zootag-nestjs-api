export const name = '20260519-0192-GsDiscountCode';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'DiscountCode',
    groupName: 'gs.admin.discountcodes',
    parentMenuName: 'تخفیف',
    menuName: 'کدهای تخفیف',
    menuUrl: '/admin/gs/discountCodes',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
