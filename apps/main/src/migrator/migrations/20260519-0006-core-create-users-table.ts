import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0006-core-create-users-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, nv, dt, bit, createTable } =
    createDialectHelpers(sequelize);

  await createTable(
    'Users',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'firstname ' + nv('256') + ' NULL',
      'lastname ' + nv('256') + ' NULL',
      'email ' + nv('256') + ' NULL',
      'username ' + nv('256') + ' NULL',
      '[password] ' + nv('1024') + ' NULL',
      'phoneNumber ' + nv('20') + ' NULL',
      'mustChangePassword ' + bit() + ' NULL',
      'lastPasswordChangeDate DATETIME NULL',
      'static_id INT NULL',
      'profilePhotoAttachmentId BIGINT NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('Users');
}
