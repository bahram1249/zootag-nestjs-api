import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260524-0293-alter-zt_contracts-drop-currencyid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_Contracts', 'currencyId', 'FK_ZT_Contracts_currencyId');
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_Contracts',
    'currencyId',
    'BIGINT',
    false,
    undefined,
    undefined,
  );
}
