import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '040-bpmn';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, ref, dt, nv, bit, createTable, addColumn, checkSetting } =
    createDialectHelpers(sequelize);

  const isBpmn = await checkSetting('key', ['SITE_NAME'], 'bpmn');
  if (!isBpmn) return;

  // BPMNProcess
  await createTable(
    'BPMNProcess',
    [
      'id INT ' + idCol + ' ' + pk,
      'name ' + nv('256') + ' NOT NULL',
      'isSubProcess ' + bit() + ' NULL',
      'isDeleted ' + bit() + ' NULL',
      'staticId INT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNConditionTypes
  await createTable(
    'BPMNConditionTypes',
    [
      'id INT PRIMARY KEY',
      'name ' + nv('256') + ' NOT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNConditions
  await createTable(
    'BPMNConditions',
    [
      'id INT ' + idCol + ' ' + pk,
      'name ' + nv('256') + ' NOT NULL',
      'conditionTypeId INT NOT NULL ' + ref('BPMNConditionTypes', 'id'),
      'conditionSource ' + nv('1024') + ' NULL',
      'conditionText ' + nv('MAX') + ' NULL',
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNActionTypes
  await createTable(
    'BPMNActionTypes',
    [
      'id INT PRIMARY KEY',
      'name ' + nv('256') + ' NOT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNActions
  await createTable(
    'BPMNActions',
    [
      'id INT ' + idCol + ' ' + pk,
      'name ' + nv('256') + ' NOT NULL',
      'actionTypeId INT NOT NULL ' + ref('BPMNActionTypes', 'id'),
      'actionSource ' + nv('1024') + ' NULL',
      'actionText ' + nv('MAX') + ' NULL',
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNActivityTypes
  await createTable(
    'BPMNActivityTypes',
    [
      'id INT PRIMARY KEY',
      'name ' + nv('256') + ' NOT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNActivities
  await createTable(
    'BPMNActivities',
    [
      'id INT ' + idCol + ' ' + pk,
      'name ' + nv('256') + ' NOT NULL',
      'isStartActivity ' + bit() + ' NOT NULL',
      'isEndActivity ' + bit() + ' NOT NULL',
      'activityTypeId INT NOT NULL ' + ref('BPMNActivityTypes', 'id'),
      'processId INT NOT NULL ' + ref('BPMNProcess', 'id'),
      'haveMultipleItems ' + bit() + ' NOT NULL',
      'insideProcessRunnerId INT NULL ' + ref('BPMNProcess', 'id'),
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNInboundActions
  await createTable(
    'BPMNInboundActions',
    [
      'id INT ' + idCol + ' ' + pk,
      'activityId INT NOT NULL ' + ref('BPMNActivities', 'id'),
      'actionId INT NOT NULL ' + ref('BPMNActions', 'id'),
      'priority INT NULL',
      'isDeleted INT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNOutboundActions
  await createTable(
    'BPMNOutboundActions',
    [
      'id INT ' + idCol + ' ' + pk,
      'activityId INT NOT NULL ' + ref('BPMNActivities', 'id'),
      'actionId INT NOT NULL ' + ref('BPMNActions', 'id'),
      'priority INT NULL',
      'isDeleted INT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNReferralTypes
  await createTable(
    'BPMNReferralTypes',
    [
      'id INT PRIMARY KEY',
      'name ' + nv('256') + ' NOT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNNodes v1
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

  // BPMNNodes v2 - ADD name, description
  await addColumn('BPMNNodes', 'name', 'NVARCHAR(512)', true);
  await addColumn('BPMNNodes', 'description', 'NVARCHAR(1024)', true);

  // BPMNNodes v3 - ADD eventCall
  await addColumn('BPMNNodes', 'eventCall', 'BIT', true);

  // BPMNNodeCommandTypes
  await createTable(
    'BPMNNodeCommandTypes',
    [
      'id INT PRIMARY KEY',
      'name ' + nv('256') + ' NOT NULL',
      'commandColor ' + nv('128') + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNNodeCommands v1
  await createTable(
    'BPMNNodeCommands',
    [
      'id INT ' + idCol + ' ' + pk,
      'nodeId INT NOT NULL ' + ref('BPMNNodes', 'id'),
      'name ' + nv('256') + ' NOT NULL',
      'nodeCommandTypeId INT NOT NULL ' + ref('BPMNNodeCommandTypes', 'id'),
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNNodeCommands v2 - ADD route
  await addColumn('BPMNNodeCommands', 'route', 'NVARCHAR(1024)', true);

  // BPMNNodeConditions (composite PK: nodeId, conditionId - no id column)
  await createTable(
    'BPMNNodeConditions',
    [
      'nodeId INT NOT NULL ' + ref('BPMNNodes', 'id'),
      'conditionId INT NOT NULL ' + ref('BPMNConditions', 'id'),
      'priority INT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (nodeId, conditionId)',
    ].join(',\n'),
  );

  // BPMNOrganizations
  await createTable(
    'BPMNOrganizations',
    [
      'id INT ' + idCol + ' ' + pk,
      'name ' + nv('1024') + ' NOT NULL',
      'isDeleted ' + bit() + ' NULL',
      'parentId INT NULL ' + ref('BPMNOrganizations', 'id'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNOccurredEvents
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

  // BPMNRequests
  await createTable(
    'BPMNRequests',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'userId BIGINT NOT NULL ' + ref('Users', 'id'),
      'processId INT NOT NULL ' + ref('BPMNProcess', 'id'),
      'organizationId INT NULL ' + ref('BPMNOrganizations', 'id'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // BPMNRequestOccurredEvents (composite PK: requestId, occurredEventId, id)
  await createTable(
    'BPMNRequestOccurredEvents',
    [
      'id BIGINT ' + idCol + ' NOT NULL',
      'requestId BIGINT NOT NULL ' + ref('BPMNRequests', 'id'),
      'occurredEventId INT NOT NULL ' + ref('BPMNOccurredEvents', 'id'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (requestId, occurredEventId, id)',
    ].join(',\n'),
  );

  // BPMNRequestStates (composite PK: requestId, id)
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

  // BPMNRequestHistories (composite PK: requestId, id)
  await createTable(
    'BPMNRequestHistories',
    [
      'id BIGINT ' + idCol + ' NOT NULL',
      'requestId BIGINT NOT NULL ' + ref('BPMNRequests', 'id'),
      'nodeId INT NOT NULL ' + ref('BPMNNodes', 'id'),
      'nodeCommandId INT NOT NULL ' + ref('BPMNNodeCommands', 'id'),
      'fromActivityId INT NOT NULL ' + ref('BPMNActivities', 'id'),
      'toActivityId INT NOT NULL ' + ref('BPMNActivities', 'id'),
      'fromUserId BIGINT NULL ' + ref('Users', 'id'),
      'fromOrganizationId INT NULL ' + ref('BPMNOrganizations', 'id'),
      'fromRoleId INT NULL ' + ref('Roles', 'id'),
      'toUserId BIGINT NULL ' + ref('Users', 'id'),
      'toRoleId INT NULL ' + ref('Roles', 'id'),
      'toOrganizationId INT NULL ' + ref('BPMNOrganizations', 'id'),
      'description ' + nv('2048') + ' NULL',
      'executeBundle ' + nv('56') + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (requestId, id)',
    ].join(',\n'),
  );

  // BPMNOrganizationUsers v1 (composite PK: organizationId, userId)
  await createTable(
    'BPMNOrganizationUsers',
    [
      'organizationId INT NOT NULL ' + ref('BPMNOrganizations', 'id'),
      'userId BIGINT NOT NULL ' + ref('Users', 'id'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (organizationId, userId)',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables(
    'BPMNOrganizationUsers',
    'BPMNRequestHistories',
    'BPMNRequestStates',
    'BPMNRequestOccurredEvents',
    'BPMNRequests',
    'BPMNOccurredEvents',
    'BPMNOrganizations',
    'BPMNNodeConditions',
    'BPMNNodeCommands',
    'BPMNNodeCommandTypes',
    'BPMNNodes',
    'BPMNReferralTypes',
    'BPMNOutboundActions',
    'BPMNInboundActions',
    'BPMNActivities',
    'BPMNActivityTypes',
    'BPMNActions',
    'BPMNActionTypes',
    'BPMNConditions',
    'BPMNConditionTypes',
    'BPMNProcess',
  );
}
