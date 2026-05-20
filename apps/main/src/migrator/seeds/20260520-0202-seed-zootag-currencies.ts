import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0202-seed-zootag-currencies';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top } = createDialectHelpers(sequelize);

  const currencies = [
    {
      code: 'IRR',
      name: 'Iranian Rial',
      symbol: '\uFDFC',
      exchangeRateToIRR: 1,
      isBaseCurrency: 1,
    },
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      exchangeRateToIRR: 420000,
      isBaseCurrency: 0,
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '\u20AC',
      exchangeRateToIRR: 480000,
      isBaseCurrency: 0,
    },
  ];

  for (const currency of currencies) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM [ZT_Currencies] WHERE code = ${ns(currency.code)}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO [ZT_Currencies] (code, name, symbol, exchangeRateToIRR, isBaseCurrency, isActive, [createdAt], [updatedAt])
         VALUES (${ns(currency.code)}, ${ns(currency.name)}, ${ns(currency.symbol)}, ${currency.exchangeRateToIRR}, ${currency.isBaseCurrency}, 1, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(
    `DELETE FROM [ZT_Currencies] WHERE code IN ('IRR', 'USD', 'EUR')`,
    { raw: true, type: QueryTypes.RAW },
  );
}
