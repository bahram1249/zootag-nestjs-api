import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0180-seed-permissions-GsGuaranteeTrackingRequests';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeTrackingRequests',
    groupName: 'gs.admin.trackingrequests',
    findParentMenu: true,
    parentMenuName: 'عملیات',
    menuName: 'پیگیری درخواست',
    menuUrl: '/admin/gs/trackingRequests',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
