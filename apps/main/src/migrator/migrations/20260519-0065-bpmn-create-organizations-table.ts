import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0065-bpmn-create-organizations-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, dt, nv, bit, ref, createTable} =
    createDialectHelpers(sequelize);


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
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNOrganizations');
}
