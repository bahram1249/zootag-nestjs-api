import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260525-0313-alter-zt_marketerdevicesaleprices-drop-validfrom';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_MarketerDeviceSalePrices', 'validFrom', undefined);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);
  await addColumn('ZT_MarketerDeviceSalePrices', 'validFrom', 'DATETIME', false, undefined, undefined);
}
