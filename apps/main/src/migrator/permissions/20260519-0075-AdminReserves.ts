export const name = '20260519-0075-AdminReserves';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'AdminReserves',
    groupName: 'discountcoffe.admin.totalreserves',
    findParentMenu: true,
    parentMenuName: 'کافه و رستوران',
    menuName: 'لیست تمامی سفارش ها',
    menuUrl: '/discountcoffe/admin/totalreserves',
    includePermissions: ['showmenu', 'getall', 'getone', 'update'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}