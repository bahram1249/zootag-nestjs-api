import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0070-bpmn-create-requesthistories-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, dt, nv, ref, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'BPMNRequestHistories',
    [
      'id BIGINT ' + idCol + ' NOT NULL',
      'requestId BIGINT NOT NULL ' +
        ref('BPMNRequests', 'id', 'BPMNRequestHistories', 'requestId'),
      'nodeId INT NOT NULL ' +
        ref('BPMNNodes', 'id', 'BPMNRequestHistories', 'nodeId'),
      'nodeCommandId INT NOT NULL ' +
        ref('BPMNNodeCommands', 'id', 'BPMNRequestHistories', 'nodeCommandId'),
      'fromActivityId INT NOT NULL ' +
        ref('BPMNActivities', 'id', 'BPMNRequestHistories', 'fromActivityId'),
      'toActivityId INT NOT NULL ' +
        ref('BPMNActivities', 'id', 'BPMNRequestHistories', 'toActivityId'),
      'fromUserId BIGINT NULL ' +
        ref('Users', 'id', 'BPMNRequestHistories', 'fromUserId'),
      'fromOrganizationId INT NULL ' +
        ref(
          'BPMNOrganizations',
          'id',
          'BPMNRequestHistories',
          'fromOrganizationId',
        ),
      'fromRoleId INT NULL ' +
        ref('Roles', 'id', 'BPMNRequestHistories', 'fromRoleId'),
      'toUserId BIGINT NULL ' +
        ref('Users', 'id', 'BPMNRequestHistories', 'toUserId'),
      'toRoleId INT NULL ' +
        ref('Roles', 'id', 'BPMNRequestHistories', 'toRoleId'),
      'toOrganizationId INT NULL ' +
        ref(
          'BPMNOrganizations',
          'id',
          'BPMNRequestHistories',
          'toOrganizationId',
        ),
      'description ' + nv('2048') + ' NULL',
      'executeBundle ' + nv('56') + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (requestId, id)',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNRequestHistories');
}
