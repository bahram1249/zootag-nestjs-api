export const name = '20260519-0020-ProductPhotos';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ProductPhotos',
    groupName: 'ecommerce.productphotos',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
