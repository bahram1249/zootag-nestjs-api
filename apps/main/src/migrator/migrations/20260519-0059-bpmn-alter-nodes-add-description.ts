import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0059-bpmn-alter-nodes-add-description';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn} = createDialectHelpers(sequelize);


  await addColumn('BPMNNodes', 'description', 'NVARCHAR(1024)', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { executeRaw } = createDialectHelpers(sequelize);
  await executeRaw('ALTER TABLE [BPMNNodes] DROP COLUMN [description]');
}
