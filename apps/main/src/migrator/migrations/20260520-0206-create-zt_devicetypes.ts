import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0206-create-zt_devicetypes';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, nv, bit } = createDialectHelpers(sequelize);

  await createTable('ZT_DeviceTypes', [
    'id BIGINT ' + idCol + ' ' + pk,
    'title ' + nv('100') + ' NOT NULL',
    'slug ' + nv('100') + ' NOT NULL',
    'isActive ' + bit() + ' NOT NULL DEFAULT 1',
    'isDeleted ' + bit() + ' NULL',
    '[createdAt] DATETIME NOT NULL',
    '[updatedAt] DATETIME NOT NULL',
  ].join(',\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_DeviceTypes');
}
