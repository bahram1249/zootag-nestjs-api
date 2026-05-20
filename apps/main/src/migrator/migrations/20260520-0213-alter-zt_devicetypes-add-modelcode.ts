import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0213-alter-zt_devicetypes-add-modelcode';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, nv } = createDialectHelpers(sequelize);
  await addColumn('ZT_DeviceTypes', 'modelCode', nv('100'), false, undefined, undefined);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_DeviceTypes', 'modelCode', undefined);
}
