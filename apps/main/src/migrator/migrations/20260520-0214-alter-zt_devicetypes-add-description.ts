import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0214-alter-zt_devicetypes-add-description';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, text } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_DeviceTypes',
    'description',
    text(),
    true,
    undefined,
    undefined,
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_DeviceTypes', 'description', undefined);
}
