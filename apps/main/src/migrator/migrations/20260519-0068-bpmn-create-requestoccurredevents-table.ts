import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0068-bpmn-create-requestoccurredevents-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, dt, ref, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'BPMNRequestOccurredEvents',
    [
      'id BIGINT ' + idCol + ' NOT NULL',
      'requestId BIGINT NOT NULL ' +
        ref('BPMNRequests', 'id', 'BPMNRequestOccurredEvents', 'requestId'),
      'occurredEventId INT NOT NULL ' +
        ref(
          'BPMNOccurredEvents',
          'id',
          'BPMNRequestOccurredEvents',
          'occurredEventId',
        ),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (requestId, occurredEventId, id)',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNRequestOccurredEvents');
}
