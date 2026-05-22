export const name = '20260520-0225-ZootagContractStatuses';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagContractStatuses',
    groupName: 'zootag.admin.contractstatuses',
    parentMenuName: 'قراردادها',
    menuName: 'وضعیت قرارداد',
    menuUrl: '/admin/zootag/contractstatuses',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
