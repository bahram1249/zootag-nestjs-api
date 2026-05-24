export const name = '20260524-0306-ZootagPetBreed';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {

  await createCrudPermissions(sequelize, {
    entityName: 'ZootagPetBreed',
    groupName: 'zootag.admin.petbreeds',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه',
    menuName: 'انواع نژاد',
    menuUrl: '/admin/zootag/petBreeds',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> { }
