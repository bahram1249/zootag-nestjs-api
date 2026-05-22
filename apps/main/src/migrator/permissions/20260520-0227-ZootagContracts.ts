export const name = '20260520-0227-ZootagContracts';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagContracts',
    groupName: 'zootag.admin.contracts',
    parentMenuName: 'مدیریت',
    menuName: 'قراردادها',
    menuUrl: '/admin/zootag/contracts',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
