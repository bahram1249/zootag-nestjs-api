import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0019-core-create-permissionmenus-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, ref, nv, dt, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'PermissionMenus',
    [
      'id INT ' + idCol + ' ' + pk,
      'menuId INT NOT NULL ' + ref('Menus', 'id', 'PermissionMenus', 'menuId'),
      'permissionId INT NOT NULL ' + ref('Permissions', 'id', 'PermissionMenus', 'permissionId'),
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('PermissionMenus');
}
