import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0001-core-create-settings-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, nv, dt, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'Settings',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      '[key] ' + nv('250') + ' NOT NULL',
      '[value] ' + nv('MAX') + ' NOT NULL',
      '[type] ' + nv('250') + ' NOT NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('Settings');
}
