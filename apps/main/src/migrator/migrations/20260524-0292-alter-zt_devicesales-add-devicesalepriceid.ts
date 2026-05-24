import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260524-0292-alter-zt_devicesales-add-devicesalepriceid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_DeviceSales',
    'deviceSalePriceId',
    'BIGINT',
    true,
    undefined,
    fkConstraint(
      'FK_ZT_DeviceSales_DeviceSalePriceId',
      'ZT_DeviceSalePrices',
      'id',
    ),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_DeviceSales',
    'deviceSalePriceId',
    'FK_ZT_DeviceSales_DeviceSalePriceId',
  );
}
