export const name = '20260519-0195-GsGuaranteeRewardHistories';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeRewardHistories',
    groupName: 'gs.report.rewardhistories',
    findParentMenu: true,
    parentMenuName: 'گزارشات',
    menuName: 'تاریخچه پاداش',
    menuUrl: '/guarantee/report/rewardHistories',
    includePermissions: ['showmenu', 'getall'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
