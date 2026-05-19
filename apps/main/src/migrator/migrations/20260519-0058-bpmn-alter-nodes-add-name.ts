import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0058-bpmn-alter-nodes-add-name';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn} = createDialectHelpers(sequelize);


  await addColumn('BPMNNodes', 'name', 'NVARCHAR(512)', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { executeRaw } = createDialectHelpers(sequelize);
  await executeRaw('ALTER TABLE [BPMNNodes] DROP COLUMN [name]');
}
