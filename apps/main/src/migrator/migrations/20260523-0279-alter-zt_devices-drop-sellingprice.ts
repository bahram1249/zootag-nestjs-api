import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0279-alter-zt_devices-drop-sellingprice';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_Devices', 'sellingPrice', undefined);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_Devices',
    'sellingPrice',
    'DECIMAL(18, 2)',
    true,
    undefined,
    undefined,
  );
}
