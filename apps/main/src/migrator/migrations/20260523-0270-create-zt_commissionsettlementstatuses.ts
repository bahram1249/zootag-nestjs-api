import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0270-create-zt_commissionsettlementstatuses';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, nv, bit, dt } = createDialectHelpers(sequelize);

  await createTable(
    'ZT_CommissionSettlementStatuses',
    [
      'id BIGINT NOT NULL PRIMARY KEY',
      'name ' + nv('100') + ' NOT NULL',
      'isActive ' + bit() + ' NOT NULL DEFAULT 1',
      '[createdAt] DATETIME NOT NULL',
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_CommissionSettlementStatuses');
}
