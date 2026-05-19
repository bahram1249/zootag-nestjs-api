import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0071-bpmn-create-organizationusers-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dt, ref, createTable} =
    createDialectHelpers(sequelize);


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
  await dropTables('BPMNOrganizationUsers');
}
