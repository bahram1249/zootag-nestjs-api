import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0130-seed-permissions-ProductComments';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ProductComments',
    groupName: 'ecommerce.admin.productcomments',
    parentMenuName: 'کامنت و بازخورد',
    menuName: 'کامنت ها',
    menuUrl: '/admin/ecommerce/productComments',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

