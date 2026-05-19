import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0064-bpmn-create-nodeconditions-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dt, ref, createTable} =
    createDialectHelpers(sequelize);


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
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNNodeConditions');
}
