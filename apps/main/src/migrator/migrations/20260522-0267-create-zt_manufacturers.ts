import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260522-0267-create-zt_manufacturers';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, nv, text, bit } =
    createDialectHelpers(sequelize);

  await createTable(
    'ZT_Manufacturers',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'manufacturerName ' + nv('200') + ' NOT NULL',
      'description ' + text() + ' NULL',
      'isActive ' + bit() + ' NOT NULL DEFAULT 1',
      'isDeleted ' + bit() + ' NOT NULL DEFAULT 0',
      '[createdAt] DATETIME NOT NULL',
      '[updatedAt] DATETIME NOT NULL',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_Manufacturers');
}
