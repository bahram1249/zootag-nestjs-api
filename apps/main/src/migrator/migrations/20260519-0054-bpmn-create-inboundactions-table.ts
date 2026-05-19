import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0054-bpmn-create-inboundactions-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, dt, ref, createTable} =
    createDialectHelpers(sequelize);


  await createTable(
    'BPMNInboundActions',
    [
      'id INT ' + idCol + ' ' + pk,
      'activityId INT NOT NULL ' + ref('BPMNActivities', 'id', 'BPMNInboundActions', 'activityId'),
      'actionId INT NOT NULL ' + ref('BPMNActions', 'id', 'BPMNInboundActions', 'actionId'),
      'priority INT NULL',
      'isDeleted INT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNInboundActions');
}
