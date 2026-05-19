import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0140-seed-permissions-HomePagePhotoss';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'HomePagePhotoss',
    groupName: 'ecommerce.homepagephotos',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

