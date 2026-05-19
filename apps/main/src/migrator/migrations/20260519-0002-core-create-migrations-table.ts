import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0002-core-create-migrations-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, nv, dt, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'Migrations',
    [
      'id BIGINT ' + idCol + ' NOT NULL',
      '[version] ' + nv('200') + ' PRIMARY KEY',
      '[description] ' + nv('500') + ' NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('Migrations');
}
