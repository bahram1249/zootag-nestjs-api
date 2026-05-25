export const name = '20260519-0176-GsGuaranteeTechnicalPersons';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeTechnicalPersons',
    groupName: 'gs.admin.technicalpersons',
    findParentMenu: true,
    parentMenuName: 'عملیات',
    menuName: 'تکنسین ها',
    menuUrl: '/admin/gs/technicalPersons',
    icon: 'wrench',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
