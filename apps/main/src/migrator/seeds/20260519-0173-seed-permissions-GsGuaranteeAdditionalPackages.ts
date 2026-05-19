import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0173-seed-permissions-GsGuaranteeAdditionalPackages';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeAdditionalPackages',
    groupName: 'gs.admin.additionalpackages',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه گارانتی',
    menuName: 'شرایط مازاد گارانتی',
    menuUrl: '/admin/gs/additionalPackages',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
