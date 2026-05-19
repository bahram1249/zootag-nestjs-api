export const name = '20260519-0019-Guarantees';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Guarantees',
    groupName: 'ecommerce.guarantees',
    findParentMenu: true,
    parentMenuName: 'محصول',
    menuName: 'گارانتی ها',
    menuUrl: '/admin/ecommerce/guarantees',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}