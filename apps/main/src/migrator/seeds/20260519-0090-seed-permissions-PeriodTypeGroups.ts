import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0090-seed-permissions-PeriodTypeGroups';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'PeriodTypeGroups',
    groupName: 'pcm.periodtypes',
    includePermissions: ['getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
