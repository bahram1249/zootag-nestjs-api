import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0053-bpmn-create-activities-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, dt, nv, ref, bit, createTable} =
    createDialectHelpers(sequelize);


  await createTable(
    'BPMNActivities',
    [
      'id INT ' + idCol + ' ' + pk,
      'name ' + nv('256') + ' NOT NULL',
      'isStartActivity ' + bit() + ' NOT NULL',
      'isEndActivity ' + bit() + ' NOT NULL',
      'activityTypeId INT NOT NULL ' + ref('BPMNActivityTypes', 'id', 'BPMNActivities', 'activityTypeId'),
      'processId INT NOT NULL ' + ref('BPMNProcess', 'id', 'BPMNActivities', 'processId'),
      'haveMultipleItems ' + bit() + ' NOT NULL',
      'insideProcessRunnerId INT NULL ' + ref('BPMNProcess', 'id', 'BPMNActivities', 'insideProcessRunnerId'),
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNActivities');
}
