import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0055-bpmn-create-outboundactions-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, dt, ref, createTable} =
    createDialectHelpers(sequelize);


  await createTable(
    'BPMNOutboundActions',
    [
      'id INT ' + idCol + ' ' + pk,
      'activityId INT NOT NULL ' + ref('BPMNActivities', 'id', 'BPMNOutboundActions', 'activityId'),
      'actionId INT NOT NULL ' + ref('BPMNActions', 'id', 'BPMNOutboundActions', 'actionId'),
      'priority INT NULL',
      'isDeleted INT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNOutboundActions');
}
