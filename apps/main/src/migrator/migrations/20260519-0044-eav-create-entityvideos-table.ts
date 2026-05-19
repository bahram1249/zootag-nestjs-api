import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0044-eav-create-entityvideos-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { ref, dt, createTable} = createDialectHelpers(sequelize);

  await createTable(
    'EAVEntityVideos',
    [
      'entityId BIGINT NOT NULL ' + ref('EAVEntities', 'entityId', 'EAVEntityVideos', 'entityId'),
      'attachmentId BIGINT NOT NULL ' + ref('Attachments', 'id', 'EAVEntityVideos', 'attachmentId'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (entityId, attachmentId)',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('EAVEntityVideos');
}
