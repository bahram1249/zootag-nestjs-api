export const name = '20260524-0297-ZootagCommissionSettlements';
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
    icon: 'credit-card',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
