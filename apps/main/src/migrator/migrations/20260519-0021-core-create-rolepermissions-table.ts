import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0021-core-create-rolepermissions-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, ref, nv, dt, createTable } =
    createDialectHelpers(sequelize);

  await createTable(
    'RolePermissions',
    [
      'id INT ' + idCol + ' ' + pk,
      'roleId INT NOT NULL ' + ref('Roles', 'id', 'RolePermissions', 'roleId'),
      'permissionId INT NOT NULL ' +
        ref('Permissions', 'id', 'RolePermissions', 'permissionId'),
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('RolePermissions');
}
