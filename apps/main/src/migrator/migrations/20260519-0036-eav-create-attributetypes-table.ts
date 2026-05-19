import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0036-eav-create-attributetypes-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nv, dt, createTable} = createDialectHelpers(sequelize);

  await createTable(
    'EAVAttributeTypes',
    [
      'id INT PRIMARY KEY',
      'name ' + nv('256') + ' NOT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('EAVAttributeTypes');
}
