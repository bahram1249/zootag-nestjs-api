import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0020-core-create-roles-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, nv, dt, bit, createTable } =
    createDialectHelpers(sequelize);

  await createTable(
    'Roles',
    [
      'id INT ' + idCol + ' ' + pk,
      'roleName ' + nv('256') + ' NOT NULL',
      'static_id INT NULL',
      '[visibility] ' + bit() + ' NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('Roles');
}
