import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0150-seed-permissions-PublicPhotos';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'PublicPhotos',
    groupName: 'ecommerce.publicphotos',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

