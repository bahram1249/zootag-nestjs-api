export const name = '20260519-0091-GsGuaranteeSolutions';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeSolutions',
    groupName: 'gs.admin.solutions',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه گارانتی',
    menuName: 'خدمات',
    menuUrl: '/admin/gs/solutions',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
