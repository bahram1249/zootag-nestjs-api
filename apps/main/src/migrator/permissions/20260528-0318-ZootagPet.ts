export const name = '20260528-0318-ZootagPet';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagPet',
    groupName: 'zootag.admin.pets',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه',
    menuName: 'پت‌ها',
    menuUrl: '/admin/zootag/pets',
    icon: 'paw-print',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
