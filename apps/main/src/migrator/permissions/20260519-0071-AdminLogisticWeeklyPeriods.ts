export const name = '20260519-0071-AdminLogisticWeeklyPeriods';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'AdminLogisticWeeklyPeriods',
    groupName: 'ecommerce.admin.logisticweeklyperiods',
    includePermissions: ['getall', 'getone', 'create'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}