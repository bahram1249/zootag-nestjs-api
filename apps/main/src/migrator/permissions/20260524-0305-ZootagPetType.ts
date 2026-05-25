export const name = '20260524-0305-ZootagPetType';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagPetType',
    groupName: 'zootag.admin.pettypes',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه',
    menuName: 'انواع پت',
    menuUrl: '/admin/zootag/petTypes',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
