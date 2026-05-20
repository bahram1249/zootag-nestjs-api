import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0062-bpmn-create-nodecommands-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, dt, nv, ref, bit, createTable } =
    createDialectHelpers(sequelize);

  await createTable(
    'BPMNNodeCommands',
    [
      'id INT ' + idCol + ' ' + pk,
      'nodeId INT NOT NULL ' +
        ref('BPMNNodes', 'id', 'BPMNNodeCommands', 'nodeId'),
      'name ' + nv('256') + ' NOT NULL',
      'nodeCommandTypeId INT NOT NULL ' +
        ref(
          'BPMNNodeCommandTypes',
          'id',
          'BPMNNodeCommands',
          'nodeCommandTypeId',
        ),
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNNodeCommands');
}
