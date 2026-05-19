import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0018-core-create-menus-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, ref, nv, dt, bit, createTable } = createDialectHelpers(sequelize);

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
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('Menus');
}
