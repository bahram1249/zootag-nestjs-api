export const name = '20260519-0169-GsNormalGuarantee';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'NormalGuarantee',
    groupName: 'gs.admin.noramlguarantees',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه گارانتی',
    menuName: 'کارت گارانتی های عادی',
    menuUrl: '/admin/gs/normalGuarantee',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
