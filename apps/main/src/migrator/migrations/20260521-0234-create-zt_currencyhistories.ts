import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0234-create-zt_currencyhistories';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, ref } = createDialectHelpers(sequelize);

  await createTable(
    'ZT_CurrencyHistories',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'currencyId BIGINT NOT NULL' +
        ' ' +
        ref('ZT_Currencies', 'id', 'ZT_CurrencyHistories', 'currencyId'),
      'exchangeRateToIRR DECIMAL(18,6) NOT NULL',
      'createdUserId BIGINT NOT NULL' +
        ' ' +
        ref('Users', 'id', 'ZT_CurrencyHistories', 'createdUserId'),
      'updatedUserId BIGINT NOT NULL' +
        ' ' +
        ref('Users', 'id', 'ZT_CurrencyHistories', 'updatedUserId'),
      '[createdAt] DATETIME NOT NULL',
      '[updatedAt] DATETIME NOT NULL',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_CurrencyHistories');
}
