import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0039-eav-create-attributevalues-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, nv, ref, bit, dt, createTable} = createDialectHelpers(sequelize);

  await createTable(
    'EAVAttributeValues',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'attributeId BIGINT NOT NULL ' + ref('EAVAttributes', 'id', 'EAVAttributeValues', 'attributeId'),
      'value ' + nv('256') + ' NULL',
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('EAVAttributeValues');
}
