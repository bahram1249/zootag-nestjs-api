export const name = '20260519-0076-CoffeReserves';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'CoffeReserves',
    groupName: 'discountcoffe.admin.reservers',
    findParentMenu: true,
    parentMenuName: 'کافه و رستوران',
    menuName: 'لیست تمامی سفارش ها',
    menuUrl: '/discountcoffe/admin/reservers',
    includePermissions: ['showmenu', 'getall', 'getone', 'update'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
