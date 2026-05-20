import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0049-bpmn-create-conditions-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, dt, nv, ref, bit, createTable } =
    createDialectHelpers(sequelize);

  await createTable(
    'BPMNConditions',
    [
      'id INT ' + idCol + ' ' + pk,
      'name ' + nv('256') + ' NOT NULL',
      'conditionTypeId INT NOT NULL ' +
        ref('BPMNConditionTypes', 'id', 'BPMNConditions', 'conditionTypeId'),
      'conditionSource ' + nv('1024') + ' NULL',
      'conditionText ' + nv('MAX') + ' NULL',
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('BPMNConditions');
}
