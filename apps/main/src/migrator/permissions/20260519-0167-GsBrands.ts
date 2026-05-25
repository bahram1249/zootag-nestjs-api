export const name = '20260519-0167-GsBrands';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'Brands',
    groupName: 'gs.admin.brands',
    parentMenuName: 'اطلاعات پایه گارانتی',
    parentIcon: 'shield',
    menuName: 'برند ها',
    menuUrl: '/admin/gs/brands',
    icon: 'building',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
