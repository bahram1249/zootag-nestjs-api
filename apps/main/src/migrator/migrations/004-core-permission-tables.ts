import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '004-core-permission-tables';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, ref, nv, dt, bit, createTable } =
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

  await createTable(
    'Menus',
    [
      'id INT ' + idCol + ' ' + pk,
      'title ' + nv('256') + ' NULL',
      'url ' + nv('1024') + ' NULL',
      'icon ' + nv('256') + ' NULL',
      'className ' + nv('256') + ' NULL',
      '[order] INT NULL',
      'parentMenuId INT NULL ' + ref('Menus', 'id'),
      '[visibility] ' + bit() + ' NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );

  await createTable(
    'PermissionMenus',
    [
      'id INT ' + idCol + ' ' + pk,
      'menuId INT NOT NULL ' + ref('Menus', 'id'),
      'permissionId INT NOT NULL ' + ref('Permissions', 'id'),
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );

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

  await createTable(
    'RolePermissions',
    [
      'id INT ' + idCol + ' ' + pk,
      'roleId INT NOT NULL ' + ref('Roles', 'id'),
      'permissionId INT NOT NULL ' + ref('Permissions', 'id'),
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );

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
  await dropTables(
    'UserRoles',
    'RolePermissions',
    'Roles',
    'PermissionMenus',
    'Menus',
    'Permissions',
    'PermissionGroups',
  );
}
