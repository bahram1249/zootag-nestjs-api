import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0003-core-create-winstonlogs-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, nv, dt, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'WinstonLogs',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      '[level] ' + nv('250') + ' NULL',
      'message ' + nv('1024') + ' NULL',
      'meta ' + nv('MAX') + ' NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('WinstonLogs');
}
