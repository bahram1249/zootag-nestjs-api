export const name = '20260520-0205-ZootagCompanies';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagCompanies',
    groupName: 'zootag.admin.companies',
    parentMenuName: 'مدیریت',
    menuName: 'شرکت‌ها',
    menuUrl: '/zootag/admin/companies',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
