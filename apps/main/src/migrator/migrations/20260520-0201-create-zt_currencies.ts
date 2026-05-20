import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0201-create-zt_currencies';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, nv, bit } = createDialectHelpers(sequelize);

  await createTable(
    'ZT_Currencies',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'code ' + nv('10') + ' NOT NULL UNIQUE',
      'name ' + nv('100') + ' NOT NULL',
      'symbol ' + nv('20') + ' NOT NULL',
      'exchangeRateToIRR DECIMAL(18,6) NOT NULL DEFAULT 0',
      'isBaseCurrency ' + bit() + ' NOT NULL DEFAULT 0',
      'isActive ' + bit() + ' NOT NULL DEFAULT 1',
      '[createdAt] DATETIME NOT NULL',
      '[updatedAt] DATETIME NOT NULL',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_Currencies');
}
