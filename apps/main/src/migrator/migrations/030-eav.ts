import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '030-eav';

export async function up(sequelize: Sequelize): Promise<void> {
  const {
    dialect,
    idCol,
    pk,
    ref,
    dt,
    nv,
    bit,
    text,
    createTable,
    addColumn,
    checkSetting,
  } = createDialectHelpers(sequelize);

  const isEcommerce = await checkSetting('key', ['SITE_NAME'], 'ecommerce');
  if (!isEcommerce) return;

  // EAVEntityModels
  await createTable(
    'EAVEntityModels',
    [
      'id INT PRIMARY KEY',
      'name ' + nv('256') + ' NOT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // EAVEntityTypes v1
  await createTable(
    'EAVEntityTypes',
    [
      'id INT ' + idCol + ' ' + pk,
      'name ' + nv('256') + ' NOT NULL',
      'slug ' + nv('512') + ' NOT NULL',
      'entityModelId INT NOT NULL ' + ref('EAVEntityModels', 'id'),
      'parentEntityTypeId INT NULL ' + ref('EAVEntityTypes', 'id'),
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // EAVEntityTypes v2 - ADD attachmentId
  await addColumn(
    'EAVEntityTypes',
    'attachmentId',
    'BIGINT',
    true,
    undefined,
    dialect === 'mssql'
      ? 'CONSTRAINT EAVEntityTypes_AttachmentId FOREIGN KEY REFERENCES Attachments([id])'
      : 'FOREIGN KEY REFERENCES Attachments("id")',
  );

  // EAVEntityTypes v3 - ADD metaTitle, metaKeywords, metaDescription
  await addColumn('EAVEntityTypes', 'metaTitle', 'NVARCHAR(512)', true);
  await addColumn('EAVEntityTypes', 'metaKeywords', 'NVARCHAR(512)', true);
  await addColumn('EAVEntityTypes', 'metaDescription', 'NVARCHAR(512)', true);

  // EAVEntityTypes v4 - ADD description
  await addColumn('EAVEntityTypes', 'description', 'NVARCHAR(MAX)', true);

  // EAVEntityTypes v5 - ADD priority
  await addColumn('EAVEntityTypes', 'priority', 'INT', true);

  // EAVEntityTypes v6 - ADD showLanding
  await addColumn('EAVEntityTypes', 'showLanding', 'BIT', true);

  // EAVAttributeTypes v1
  await createTable(
    'EAVAttributeTypes',
    [
      'id INT PRIMARY KEY',
      'name ' + nv('256') + ' NOT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // EAVAttributeTypes v2 - ADD valueBased
  await addColumn('EAVAttributeTypes', 'valueBased', 'BIT', true);

  // EAVAttributes
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

  // EAVAttributeValues
  await createTable(
    'EAVAttributeValues',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'attributeId BIGINT NOT NULL ' + ref('EAVAttributes', 'id'),
      'value ' + nv('256') + ' NULL',
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // EAVEntityAttributes (composite PK: entityTypeId, attributeId)
  await createTable(
    'EAVEntityAttributes',
    [
      'entityTypeId INT NOT NULL ' + ref('EAVEntityTypes', 'id'),
      'attributeId BIGINT NOT NULL ' + ref('EAVAttributes', 'id'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (entityTypeId, attributeId)',
    ].join(',\n'),
  );

  // EAVEntities
  await createTable(
    'EAVEntities',
    [
      'entityId BIGINT ' + idCol + ' ' + pk,
      'entityTypeId INT NOT NULL ' + ref('EAVEntityTypes', 'id'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // EAVEntityAttributeValues (composite PK: entityId, attributeId)
  await createTable(
    'EAVEntityAttributeValues',
    [
      'entityId BIGINT NOT NULL ' + ref('EAVEntities', 'entityId'),
      'attributeId BIGINT NOT NULL ' + ref('EAVAttributes', 'id'),
      'val ' + nv('1024') + ' NULL',
      'attributeValueId BIGINT NULL ' + ref('EAVAttributeValues', 'id'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (entityId, attributeId)',
    ].join(',\n'),
  );

  // EAVEntityPhotos v1 (composite PK: entityId, attachmentId)
  await createTable(
    'EAVEntityPhotos',
    [
      'entityId BIGINT NOT NULL ' + ref('EAVEntities', 'entityId'),
      'attachmentId BIGINT NOT NULL ' + ref('Attachments', 'id'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (entityId, attachmentId)',
    ].join(',\n'),
  );

  // EAVEntityVideos (composite PK: entityId, attachmentId)
  await createTable(
    'EAVEntityVideos',
    [
      'entityId BIGINT NOT NULL ' + ref('EAVEntities', 'entityId'),
      'attachmentId BIGINT NOT NULL ' + ref('Attachments', 'id'),
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
      'PRIMARY KEY (entityId, attachmentId)',
    ].join(',\n'),
  );

  // EAVBlogPublishes
  await createTable(
    'EAVBlogPublishes',
    [
      'id INT PRIMARY KEY',
      'name ' + nv('256') + ' NOT NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );

  // EAVPosts
  await createTable(
    'EAVPosts',
    [
      'id BIGINT PRIMARY KEY',
      'entityTypeId INT NULL ' + ref('EAVEntityTypes', 'id'),
      'publishId INT NOT NULL ' + ref('EAVBlogPublishes', 'id'),
      'slug ' + nv('1024') + ' NOT NULL',
      'title ' + nv('256') + ' NOT NULL',
      'description ' + text() + ' NOT NULL',
      'metaTitle ' + nv('256') + ' NULL',
      'metaDescription ' + nv('512') + ' NULL',
      'metaKeywords ' + nv('512') + ' NULL',
      'userId BIGINT NULL ' + ref('Users', 'id'),
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables(
    'EAVPosts',
    'EAVBlogPublishes',
    'EAVEntityVideos',
    'EAVEntityPhotos',
    'EAVEntityAttributeValues',
    'EAVEntities',
    'EAVEntityAttributes',
    'EAVAttributeValues',
    'EAVAttributes',
    'EAVAttributeTypes',
    'EAVEntityTypes',
    'EAVEntityModels',
  );
}
