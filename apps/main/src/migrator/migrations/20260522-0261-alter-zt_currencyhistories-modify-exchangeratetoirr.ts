import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name =
  '20260522-0261-alter-zt_currencyhistories-modify-exchangeratetoirr';

export async function up(sequelize: Sequelize): Promise<void> {
  const { alterColumn } = createDialectHelpers(sequelize);
  await alterColumn(
    'ZT_CurrencyHistories',
    'exchangeRateToIRR',
    'DECIMAL(18, 6)',
    false,
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { alterColumn } = createDialectHelpers(sequelize);
  await alterColumn(
    'ZT_CurrencyHistories',
    'exchangeRateToIRR',
    'DECIMAL',
    false,
  );
}
