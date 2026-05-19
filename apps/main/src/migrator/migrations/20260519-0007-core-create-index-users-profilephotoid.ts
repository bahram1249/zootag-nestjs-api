import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0007-core-create-index-users-profilephotoid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dialect, executeRaw } = createDialectHelpers(sequelize);

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
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dialect, executeRaw } = createDialectHelpers(sequelize);

  if (dialect === 'mssql') {
    await executeRaw('DROP INDEX [NIX_Users_ProfilePhotoId] ON Users');
  } else {
    await executeRaw('DROP INDEX IF EXISTS NIX_Users_ProfilePhotoId');
  }
}
