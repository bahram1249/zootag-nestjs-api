export const name = '20260519-0178-GsFactors';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Factors',
    groupName: 'gs.admin.factors',
    findParentMenu: true,
    parentMenuName: 'عملیات',
    menuName: 'فاکتور ها',
    menuUrl: '/admin/gs/factors',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
