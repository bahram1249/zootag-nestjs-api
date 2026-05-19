import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0060-bpmn-alter-nodes-add-eventcall';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn} = createDialectHelpers(sequelize);


  await addColumn('BPMNNodes', 'eventCall', 'BIT', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { executeRaw } = createDialectHelpers(sequelize);
  await executeRaw('ALTER TABLE [BPMNNodes] DROP COLUMN [eventCall]');
}
