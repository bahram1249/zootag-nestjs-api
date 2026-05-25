export const name = '20260519-0184-GsGuaranteePreRegistrationOrganizations';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteePreRegistrationOrganizations',
    groupName: 'gs.admin.preregistrationorganizations',
    findParentMenu: true,
    parentMenuName: 'عملیات',
    menuName: 'لیست ثبت نام نمایندگان',
    menuUrl: '/admin/gs/preRegistrationOrganizations',
    icon: 'clipboard',
    includePermissions: ['showmenu', 'getall', 'getone', 'update', 'delete'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
