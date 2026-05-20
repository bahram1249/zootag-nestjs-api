import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0221-create-zt_contracts';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, ref, nv, text, bit } = createDialectHelpers(sequelize);

  await createTable('ZT_Contracts', [
    'id BIGINT ' + idCol + ' ' + pk,
    'companyId BIGINT NOT NULL' + ' ' + ref('ZT_Companies', 'id', 'ZT_Contracts', 'companyId'),
    'contractNumber ' + nv('100') + ' NOT NULL',
    'title ' + nv('200') + ' NOT NULL',
    'startDate DATETIME NOT NULL',
    'endDate DATETIME NOT NULL',
    'currencyId BIGINT NOT NULL' + ' ' + ref('ZT_Currencies', 'id', 'ZT_Contracts', 'currencyId'),
    'contractStatusId BIGINT NOT NULL' + ' ' + ref('ZT_ContractStatuses', 'id', 'ZT_Contracts', 'contractStatusId'),
    'notes ' + text() + ' NULL',
    'isActive ' + bit() + ' NOT NULL DEFAULT 1',
    'isDeleted ' + bit() + ' NULL',
    '[createdAt] DATETIME NOT NULL',
    '[updatedAt] DATETIME NOT NULL',
  ].join(',\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_Contracts');
}
