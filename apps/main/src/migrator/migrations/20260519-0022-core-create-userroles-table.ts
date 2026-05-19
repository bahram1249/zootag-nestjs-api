import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0022-core-create-userroles-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, ref, nv, dt, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'UserRoles',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'userId BIGINT NOT NULL ' + ref('Users', 'id'),
      'roleId INT NOT NULL ' + ref('Roles', 'id'),
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('UserRoles');
}
