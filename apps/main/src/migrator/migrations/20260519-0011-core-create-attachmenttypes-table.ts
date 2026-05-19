import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0011-core-create-attachmenttypes-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nv, dt, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'AttachmentTypes',
    [
      'id INT PRIMARY KEY',
      'typeName ' + nv('256') + ' NOT NULL',
      '[order] INT NULL',
      '[settings] ' + nv('1024') + ' NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('AttachmentTypes');
}
