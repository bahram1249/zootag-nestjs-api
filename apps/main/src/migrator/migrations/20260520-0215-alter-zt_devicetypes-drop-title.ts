import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0215-alter-zt_devicetypes-drop-title';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dropColumn, nv } = createDialectHelpers(sequelize);
  await dropColumn('ZT_DeviceTypes', 'title', undefined);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { addColumn, nv } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_DeviceTypes',
    'title',
    nv('100'),
    false,
    undefined,
    undefined,
  );
}
