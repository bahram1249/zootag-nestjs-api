export const name = '20260519-0098-GsGuaranteeResponse';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeResponse',
    groupName: 'gs.admin.response',
    parentMenuName: 'گزارشات',
    menuName: 'نظر سنجی ها',
    menuUrl: '/admin/gs/surveys',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}