import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0040-eav-create-entityattributes-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { ref, dt, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'EAVEntityAttributes',
    [
      'entityTypeId INT NOT NULL ' +
        ref('EAVEntityTypes', 'id', 'EAVEntityAttributes', 'entityTypeId'),
      'attributeId BIGINT NOT NULL ' +
        ref('EAVAttributes', 'id', 'EAVEntityAttributes', 'attributeId'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (entityTypeId, attributeId)',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('EAVEntityAttributes');
}
