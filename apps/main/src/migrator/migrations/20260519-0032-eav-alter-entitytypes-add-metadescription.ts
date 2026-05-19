import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0032-eav-alter-entitytypes-add-metadescription';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);

  await addColumn('EAVEntityTypes', 'metaDescription', 'NVARCHAR(512)', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { executeRaw } = createDialectHelpers(sequelize);
  await executeRaw(
    'ALTER TABLE [EAVEntityTypes] DROP COLUMN [metaDescription]',
  );
}
