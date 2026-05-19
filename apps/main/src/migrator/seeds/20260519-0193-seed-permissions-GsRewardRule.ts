import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0193-seed-permissions-GsRewardRule';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'RewardRule',
    groupName: 'gs.admin.rewardrules',
    findParentMenu: true,
    parentMenuName: 'تخفیف',
    menuName: 'قوانین پاداش',
    menuUrl: '/admin/gs/rewardRules',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
