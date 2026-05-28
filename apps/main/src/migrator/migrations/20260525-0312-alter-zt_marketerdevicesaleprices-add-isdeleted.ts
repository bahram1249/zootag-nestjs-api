import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name =
  '20260525-0312-alter-zt_marketerdevicesaleprices-add-isdeleted';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, bit } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_MarketerDeviceSalePrices',
    'isDeleted',
    bit(),
    false,
    '0',
    undefined,
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_MarketerDeviceSalePrices', 'isDeleted', undefined);
}
