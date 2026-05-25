export const name = '20260519-0130-ProductComments';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ProductComments',
    groupName: 'ecommerce.admin.productcomments',
    parentMenuName: 'کامنت و بازخورد',
    parentIcon: 'message-circle',
    menuName: 'کامنت ها',
    menuUrl: '/admin/ecommerce/productComments',
    icon: 'circle',
    includePermissions: ['showmenu', 'getall', 'getone'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
