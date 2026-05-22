export const name = '20260522-0269-ZootagManufacturers';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagManufacturers',
    groupName: 'zootag.admin.manufacturers',
    parentMenuName: 'مدیریت',
    menuName: 'سازنده‌ها',
    menuUrl: '/zootag/admin/manufacturers',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
