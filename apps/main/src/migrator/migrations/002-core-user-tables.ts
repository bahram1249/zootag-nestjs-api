import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '002-core-user-tables';

export async function up(sequelize: Sequelize): Promise<void> {
  const {
    dialect,
    idCol,
    pk,
    nv,
    dt,
    bit,
    addColumn,
    executeRaw,
    createTable,
  } = createDialectHelpers(sequelize);

  await createTable(
    'UserTypes',
    [
      'id INT PRIMARY KEY',
      'title ' + nv('256') + ' NOT NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );

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

  if (dialect === 'mssql') {
    await executeRaw(
      `CREATE NONCLUSTERED INDEX [NIX_Users_ProfilePhotoId] ON Users(profilePhotoAttachmentId)
      INCLUDE (id, firstname,lastname,username, phoneNumber)`,
    );
  } else {
    await executeRaw(
      `CREATE INDEX NIX_Users_ProfilePhotoId ON Users (profilePhotoAttachmentId)`,
    );
  }

  await addColumn('Users', 'birthDate', 'DATE', true);
  await addColumn('Users', 'nationalCode', 'NVARCHAR(25)', true);
  await addColumn(
    'Users',
    'userTypeId',
    'INT',
    true,
    '1',
    dialect === 'mssql'
      ? 'CONSTRAINT FK_Users_UserTypeId FOREIGN KEY REFERENCES UserTypes(id)'
      : 'REFERENCES UserTypes(id)',
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('Users', 'UserTypes');
}
