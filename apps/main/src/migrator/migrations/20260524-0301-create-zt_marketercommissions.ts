import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260524-0301-create-zt_marketercommissions';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, ref, bit } = createDialectHelpers(sequelize);

  await createTable('ZT_MarketerCommissions', [
    'id BIGINT ' + idCol + ' ' + pk,
    'marketerId BIGINT NOT NULL' + ' ' + ref('ZT_Marketers', 'id', 'ZT_MarketerCommissions', 'marketerId'),
    'commissionTypeId BIGINT NOT NULL' + ' ' + ref('ZT_CommissionTypes', 'id', 'ZT_MarketerCommissions', 'commissionTypeId'),
    'commissionValue DECIMAL(18, 2) NOT NULL',
    'startDate DATE NOT NULL',
    'endDate DATE NULL',
    'priority INT NOT NULL DEFAULT 0',
    'isActive ' + bit() + ' NOT NULL DEFAULT 1',
    'createdUserId BIGINT NOT NULL' + ' ' + ref('Users', 'id', 'ZT_MarketerCommissions', 'createdUserId'),
    'updatedUserId BIGINT NOT NULL' + ' ' + ref('Users', 'id', 'ZT_MarketerCommissions', 'updatedUserId'),
    '[createdAt] DATETIME NOT NULL',
    '[updatedAt] DATETIME NOT NULL',
  ].join(',\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_MarketerCommissions');
}
