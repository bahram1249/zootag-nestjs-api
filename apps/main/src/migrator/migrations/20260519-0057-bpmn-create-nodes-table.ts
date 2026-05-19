import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0057-bpmn-create-nodes-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, dt, nv, ref, bit, createTable} =
    createDialectHelpers(sequelize);


  await createTable(
    'BPMNNodes',
    [
      'id INT ' + idCol + ' ' + pk,
      'fromActivityId INT NOT NULL ' + ref('BPMNActivities', 'id'),
      'toActivityId INT NOT NULL ' + ref('BPMNActivities', 'id'),
      'autoIterate ' + bit() + ' NOT NULL',
      'conditionFailedActionRunnerId INT NULL ' + ref('BPMNActions', 'id'),
      'referralTypeId INT NOT NULL ' + ref('BPMNReferralTypes', 'id'),
      'roleId INT NULL ' + ref('Roles', 'id'),
      'userId BIGINT NULL ' + ref('Users', 'id'),
      'injectForm ' + nv('256') + ' NULL',
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNNodes');
}
