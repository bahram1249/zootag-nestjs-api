import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0038-eav-create-attributes-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, nv, ref, bit, dt, createTable} = createDialectHelpers(sequelize);

  await createTable(
    'EAVAttributes',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'name ' + nv('256') + ' NOT NULL',
      'attributeTypeId INT NOT NULL ' + ref('EAVAttributeTypes', 'id'),
      'minLength INT NULL',
      'maxLength INT NULL',
      'required ' + bit() + ' NULL',
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('EAVAttributes');
}
