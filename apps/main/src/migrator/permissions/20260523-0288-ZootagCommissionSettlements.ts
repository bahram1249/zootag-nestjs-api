export const name = '20260523-0288-ZootagCommissionSettlements';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagCommissionSettlements',
    groupName: 'zootag.admin.commissionsettlements',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه',
    menuName: 'تسویه‌های کمیسیون',
    menuUrl: '/admin/zootag/commission-settlements',
  });
}
export async function down(): Promise<void> {}
