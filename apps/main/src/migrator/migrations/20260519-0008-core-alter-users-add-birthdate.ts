import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0008-core-alter-users-add-birthdate';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);

  await addColumn('Users', 'birthDate', 'DATE', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { executeRaw, quote } = createDialectHelpers(sequelize);

  await executeRaw(`ALTER TABLE Users DROP COLUMN ${quote('birthDate')}`);
}
