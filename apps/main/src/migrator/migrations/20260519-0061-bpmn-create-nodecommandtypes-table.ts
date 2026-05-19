import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0061-bpmn-create-nodecommandtypes-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dt, nv, createTable} =
    createDialectHelpers(sequelize);


  await createTable(
    'BPMNNodeCommandTypes',
    [
      'id INT PRIMARY KEY',
      'name ' + nv('256') + ' NOT NULL',
      'commandColor ' + nv('128') + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNNodeCommandTypes');
}
