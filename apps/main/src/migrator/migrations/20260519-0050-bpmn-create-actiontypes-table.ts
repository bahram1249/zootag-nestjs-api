import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0050-bpmn-create-actiontypes-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dt, nv, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'BPMNActionTypes',
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
  await dropTables('BPMNActionTypes');
}
