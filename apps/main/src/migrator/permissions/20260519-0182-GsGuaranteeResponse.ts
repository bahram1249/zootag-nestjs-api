export const name = '20260519-0182-GsGuaranteeResponse';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeResponse',
    groupName: 'gs.admin.response',
    parentMenuName: 'گزارشات',
    parentIcon: 'bar-chart',
    menuName: 'نظر سنجی ها',
    menuUrl: '/admin/gs/surveys',
    icon: 'message-square',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
