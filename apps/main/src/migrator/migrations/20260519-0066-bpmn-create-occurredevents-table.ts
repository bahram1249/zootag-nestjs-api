import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0066-bpmn-create-occurredevents-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, dt, nv, bit, createTable } =
    createDialectHelpers(sequelize);

  await createTable(
    'BPMNOccurredEvents',
    [
      'id INT ' + idCol + ' ' + pk,
      'name ' + nv('1024') + ' NOT NULL',
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNOccurredEvents');
}
