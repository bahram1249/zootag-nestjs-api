import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0016-core-create-permissiongroups-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, nv, dt, bit, createTable } =
    createDialectHelpers(sequelize);

  await createTable(
    'PermissionGroups',
    [
      'id INT ' + idCol + ' ' + pk,
      'permissionGroupName ' + nv('256') + ' NULL',
      '[visibility] ' + bit() + ' NULL',
      '[order] INT NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('PermissionGroups');
}
