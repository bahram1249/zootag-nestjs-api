import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0231-create-zt_contractperiods';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, ref, nv, text, bit } = createDialectHelpers(sequelize);

  await createTable('ZT_ContractPeriods', [
    'id BIGINT ' + idCol + ' ' + pk,
    'contractId BIGINT NOT NULL' + ' ' + ref('ZT_Contracts', 'id', 'ZT_ContractPeriods', 'contractId'),
    'periodName ' + nv('200') + ' NOT NULL',
    'startDate DATETIME NOT NULL',
    'endDate DATETIME NOT NULL',
    'contractPeriodStatusId BIGINT NOT NULL' + ' ' + ref('ZT_ContractPeriodStatuses', 'id', 'ZT_ContractPeriods', 'contractPeriodStatusId'),
    'notes ' + text() + ' NULL',
    'isActive ' + bit() + ' NOT NULL DEFAULT 1',
    'isDeleted ' + bit() + ' NULL',
    '[createdAt] DATETIME NOT NULL',
    '[updatedAt] DATETIME NOT NULL',
  ].join(',\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_ContractPeriods');
}
