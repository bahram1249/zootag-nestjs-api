import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0179-seed-permissions-GsGuaranteeVipGenerators';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeVipGenerators',
    groupName: 'gs.admin.vipgenerators',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه گارانتی',
    menuName: 'صددور کارت گارانتی وی آی پی',
    menuUrl: '/admin/gs/vipGenerators',
    includePermissions: ['showmenu', 'getall', 'getone', 'create'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
