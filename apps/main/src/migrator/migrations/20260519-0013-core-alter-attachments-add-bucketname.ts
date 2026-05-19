import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0013-core-alter-attachments-add-bucketname';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);

  await addColumn('Attachments', 'bucketName', 'NVARCHAR(256)', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { executeRaw, quote } = createDialectHelpers(sequelize);

  await executeRaw(
    `ALTER TABLE Attachments DROP COLUMN ${quote('bucketName')}`,
  );
}
