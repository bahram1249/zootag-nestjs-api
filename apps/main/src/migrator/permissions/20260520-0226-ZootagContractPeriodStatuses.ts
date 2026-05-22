export const name = '20260520-0226-ZootagContractPeriodStatuses';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagContractPeriodStatuses',
    groupName: 'zootag.admin.contractperiodstatuses',
    parentMenuName: 'قراردادها',
    menuName: 'وضعیت دوره قرارداد',
    menuUrl: '/admin/zootag/contractperiodstatuses',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
