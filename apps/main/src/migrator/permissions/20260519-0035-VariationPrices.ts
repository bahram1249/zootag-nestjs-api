export const name = '20260519-0035-VariationPrices';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'VariationPrices',
    groupName: 'ecommerce.admin.variationprices',
    includePermissions: ['getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}