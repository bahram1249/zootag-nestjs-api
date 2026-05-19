import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0012-core-create-attachments-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, ref, nv, dt, bit, createTable } = createDialectHelpers(sequelize);

  await createTable(
    'Attachments',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'originalFileName ' + nv('512') + ' NULL',
      'fileName ' + nv('512') + ' NULL',
      'ext ' + nv('32') + ' NULL',
      'mimetype ' + nv('64') + ' NULL',
      '[path] ' + nv('1024') + ' NULL',
      '[thumbnailPath] ' + nv('1024') + ' NULL',
      'attachmentTypeId INT NULL ' + ref('AttachmentTypes', 'id'),
      'userId BIGINT NULL ' + ref('Users', 'id'),
      'persianDate ' + nv('32') + ' NULL',
      'persianMonth ' + nv('16') + ' NULL',
      'isDeleted ' + bit() + ' NULL',
      'deletedDate DATETIME NULL',
      'deletedBy BIGINT NULL ' + ref('Users', 'id'),
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('Attachments');
}
