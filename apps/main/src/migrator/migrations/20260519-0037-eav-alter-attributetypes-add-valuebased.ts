import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0037-eav-alter-attributetypes-add-valuebased';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn} = createDialectHelpers(sequelize);

  await addColumn('EAVAttributeTypes', 'valueBased', 'BIT', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { executeRaw } = createDialectHelpers(sequelize);
  await executeRaw('ALTER TABLE [EAVAttributeTypes] DROP COLUMN [valueBased]');
}
