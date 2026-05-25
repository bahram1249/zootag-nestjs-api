export const name = '20260519-0183-GsGuaranteeSupplierPersons';
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
    icon: 'truck',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
