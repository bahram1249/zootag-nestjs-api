export const name = '20260520-0228-ZootagContractPeriods';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagContractPeriods',
    groupName: 'zootag.admin.contractperiods',
    parentMenuName: 'قراردادها',
    menuName: 'دوره‌های قرارداد',
    menuUrl: '/admin/zootag/contractperiods',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
