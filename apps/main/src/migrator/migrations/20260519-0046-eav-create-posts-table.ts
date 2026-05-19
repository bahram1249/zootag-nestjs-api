import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0046-eav-create-posts-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nv, ref, bit, text, dt, createTable} = createDialectHelpers(sequelize);

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
  await dropTables('EAVPosts');
}
