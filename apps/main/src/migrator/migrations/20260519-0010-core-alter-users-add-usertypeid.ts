import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0010-core-alter-users-add-usertypeid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dialect, addColumn } = createDialectHelpers(sequelize);

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
  const { dialect, executeRaw, quote } = createDialectHelpers(sequelize);

  if (dialect === 'mssql') {
    await executeRaw('ALTER TABLE Users DROP CONSTRAINT FK_Users_UserTypeId');
  }
  await executeRaw(`ALTER TABLE Users DROP COLUMN ${quote('userTypeId')}`);
}
