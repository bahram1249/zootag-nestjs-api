export const name = '20260519-0066-PublicPhotos';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'PublicPhotos',
    groupName: 'ecommerce.publicphotos',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}