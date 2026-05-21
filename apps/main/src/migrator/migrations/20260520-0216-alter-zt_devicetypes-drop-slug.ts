import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0216-alter-zt_devicetypes-drop-slug';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dropColumn, nv } = createDialectHelpers(sequelize);
  await dropColumn('ZT_DeviceTypes', 'slug', undefined);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { addColumn, nv } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_DeviceTypes',
    'slug',
    nv('100'),
    false,
    undefined,
    undefined,
  );
}
