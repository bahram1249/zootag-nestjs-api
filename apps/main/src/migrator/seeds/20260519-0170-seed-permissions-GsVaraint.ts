import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0170-seed-permissions-GsVaraint';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Varaint',
    groupName: 'gs.admin.variants',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه گارانتی',
    menuName: 'مدل دستگاه ها',
    menuUrl: '/admin/gs/variants',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
