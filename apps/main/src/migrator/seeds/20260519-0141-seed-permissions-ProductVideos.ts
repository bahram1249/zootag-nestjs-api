import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0141-seed-permissions-ProductVideos';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ProductVideos',
    groupName: 'ecommerce.productvideos',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

