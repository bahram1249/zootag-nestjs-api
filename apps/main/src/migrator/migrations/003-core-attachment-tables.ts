import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '003-core-attachment-tables';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, ref, nv, dt, bit, createTable, addColumn } =
    createDialectHelpers(sequelize);

  await createTable(
    'AttachmentTypes',
    [
      'id INT PRIMARY KEY',
      'typeName ' + nv('256') + ' NOT NULL',
      '[order] INT NULL',
      '[settings] ' + nv('1024') + ' NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );

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

  await addColumn('Attachments', 'bucketName', 'NVARCHAR(256)', true);
  await addColumn('Attachments', 'etag', 'NVARCHAR(256)', true);
  await addColumn('Attachments', 'versionId', 'NVARCHAR(256)', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('Attachments', 'AttachmentTypes');
}
