export const name = '20260519-0110-GsGuaranteeDiscountCodeUsages';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeDiscountCodeUsages',
    groupName: 'gs.report.discountcodeusages',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'گزارش استفاده از کد تخفیف',
    menuUrl: '/admin/gs/discountCodeUsages',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}