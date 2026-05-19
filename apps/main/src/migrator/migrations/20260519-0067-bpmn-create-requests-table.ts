import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0067-bpmn-create-requests-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, dt, ref, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'BPMNRequests',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'userId BIGINT NOT NULL ' + ref('Users', 'id', 'BPMNRequests', 'userId'),
      'processId INT NOT NULL ' +
        ref('BPMNProcess', 'id', 'BPMNRequests', 'processId'),
      'organizationId INT NULL ' +
        ref('BPMNOrganizations', 'id', 'BPMNRequests', 'organizationId'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNRequests');
}
