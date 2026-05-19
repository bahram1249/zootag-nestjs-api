import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0186-seed-permissions-GsGuaranteeSubscriptions';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeSubscriptions',
    groupName: 'gs.admin.subscriptions',
    parentMenuName: 'باشگاه مشتریان',
    menuName: 'لیست ثبت نام',
    menuUrl: '/admin/gs/subscriptions',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
