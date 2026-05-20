export const name = '20260519-0171-GsGuaranteeOrganizations';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'GuaranteeOrganizations',
    groupName: 'gs.admin.guaranteeorganizations',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه گارانتی',
    menuName: 'نمایندگان',
    menuUrl: '/admin/gs/guaranteeOrganizations',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
