import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0063-bpmn-alter-nodecommands-add-route';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);

  await addColumn('BPMNNodeCommands', 'route', 'NVARCHAR(1024)', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { executeRaw } = createDialectHelpers(sequelize);
  await executeRaw('ALTER TABLE [BPMNNodeCommands] DROP COLUMN [route]');
}
