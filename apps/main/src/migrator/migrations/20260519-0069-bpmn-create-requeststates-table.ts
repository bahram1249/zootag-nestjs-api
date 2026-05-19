import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0069-bpmn-create-requeststates-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, dt, ref, createTable} =
    createDialectHelpers(sequelize);


  await createTable(
    'BPMNRequestStates',
    [
      'id BIGINT ' + idCol + ' NOT NULL',
      'requestId BIGINT NOT NULL ' + ref('BPMNRequests', 'id'),
      'activityId INT NOT NULL ' + ref('BPMNActivities', 'id'),
      'userId BIGINT NULL ' + ref('Users', 'id'),
      'roleId INT NULL ' + ref('Roles', 'id'),
      'organizationId INT NULL ' + ref('BPMNOrganizations', 'id'),
      'returnRequestStateId BIGINT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (requestId, id)',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNRequestStates');
}
