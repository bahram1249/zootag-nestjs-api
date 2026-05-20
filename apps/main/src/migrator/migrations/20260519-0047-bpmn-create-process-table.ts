import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0047-bpmn-create-process-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, dt, nv, bit, createTable } =
    createDialectHelpers(sequelize);

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
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNProcess');
}
