import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0200-alter-coresessions-modify-lastactivityat';

export async function up(sequelize: Sequelize): Promise<void> {
  const { alterColumn } = createDialectHelpers(sequelize);
  await alterColumn('CoreSessions', 'lastActivityAt', 'DATETIME', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { alterColumn } = createDialectHelpers(sequelize);
  await alterColumn('CoreSessions', 'lastActivityAt', 'DATE', true);
}
