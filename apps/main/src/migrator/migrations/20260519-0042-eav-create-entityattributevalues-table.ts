import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0042-eav-create-entityattributevalues-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nv, ref, dt, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'EAVEntityAttributeValues',
    [
      'entityId BIGINT NOT NULL ' +
        ref('EAVEntities', 'entityId', 'EAVEntityAttributeValues', 'entityId'),
      'attributeId BIGINT NOT NULL ' +
        ref('EAVAttributes', 'id', 'EAVEntityAttributeValues', 'attributeId'),
      'val ' + nv('1024') + ' NULL',
      'attributeValueId BIGINT NULL ' +
        ref(
          'EAVAttributeValues',
          'id',
          'EAVEntityAttributeValues',
          'attributeValueId',
        ),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (entityId, attributeId)',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('EAVEntityAttributeValues');
}
