import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0017-core-create-permissions-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, ref, nv, dt, bit, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'Permissions',
    [
      'id INT ' + idCol + ' ' + pk,
      'permissionSymbol ' + nv('512') + ' NULL',
      'permissionName ' + nv('256') + ' NULL',
      'permissionUrl ' + nv('1024') + ' NULL',
      'permissionMethod ' + nv('10') + ' NULL',
      'permissionGroupId INT NULL ' + ref('PermissionGroups', 'id'),
      '[visibility] ' + bit() + ' NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('Permissions');
}
