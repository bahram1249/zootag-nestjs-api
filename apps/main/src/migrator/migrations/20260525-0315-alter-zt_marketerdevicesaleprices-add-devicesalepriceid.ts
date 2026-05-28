import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name =
  '20260525-0315-alter-zt_marketerdevicesaleprices-add-devicesalepriceid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_MarketerDeviceSalePrices',
    'deviceSalePriceId',
    'BIGINT',
    true,
    undefined,
    fkConstraint(
      'FK_ZT_MarketerDeviceSalePrices_DeviceSalePriceId',
      'ZT_DeviceSalePrices',
      'id',
    ),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_MarketerDeviceSalePrices',
    'deviceSalePriceId',
    'FK_ZT_MarketerDeviceSalePrices_DeviceSalePriceId',
  );
}
