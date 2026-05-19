import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0041-eav-create-entities-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, ref, dt, createTable} = createDialectHelpers(sequelize);

  await createTable(
    'EAVEntities',
    [
      'entityId BIGINT ' + idCol + ' ' + pk,
      'entityTypeId INT NOT NULL ' + ref('EAVEntityTypes', 'id', 'EAVEntities', 'entityTypeId'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('EAVEntities');
}
