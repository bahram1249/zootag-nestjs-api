export const name = '20260519-0099-GsGuaranteeSupplierPersons';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeSupplierPersons',
    groupName: 'gs.admin.supplierpersons',
    findParentMenu: true,
    parentMenuName: 'عملیات',
    menuName: 'تامین کنندگان',
    menuUrl: '/admin/gs/supplierPersons',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}