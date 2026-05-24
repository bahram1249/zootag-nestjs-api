export const name = '20260524-0298-ZootagCommissionSettlementStatuses';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagCommissionSettlementStatuses',
    groupName: 'zootag.admin.commissionsettlementstatuses',
    includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
