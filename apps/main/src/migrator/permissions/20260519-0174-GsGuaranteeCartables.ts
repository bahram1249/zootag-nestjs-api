export const name = '20260519-0174-GsGuaranteeCartables';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeCartables',
    groupName: 'gs.admin.cartables',
    parentMenuName: 'عملیات',
    parentIcon: 'clipboard',
    menuName: 'کارتابل',
    menuUrl: '/admin/gs/cartables',
    icon: 'inbox',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
