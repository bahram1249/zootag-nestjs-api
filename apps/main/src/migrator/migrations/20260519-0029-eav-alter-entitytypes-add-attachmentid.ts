import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0029-eav-alter-entitytypes-add-attachmentid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dialect, addColumn} = createDialectHelpers(sequelize);

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
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { executeRaw } = createDialectHelpers(sequelize);
  await executeRaw('ALTER TABLE [EAVEntityTypes] DROP COLUMN [attachmentId]');
}
