import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0177-seed-permissions-GsGuaranteeVipBundleType';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeVipBundleType',
    groupName: 'gs.admin.vipbundletypes',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه گارانتی',
    menuName: 'انواع کارت های گارانتی',
    menuUrl: '/admin/gs/vipBundleTypes',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
