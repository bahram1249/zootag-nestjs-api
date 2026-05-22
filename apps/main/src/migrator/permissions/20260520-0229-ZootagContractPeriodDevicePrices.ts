export const name = '20260520-0229-ZootagContractPeriodDevicePrices';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagContractPeriodDevicePrices',
    groupName: 'zootag.admin.contractperioddeviceprices',
    includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
