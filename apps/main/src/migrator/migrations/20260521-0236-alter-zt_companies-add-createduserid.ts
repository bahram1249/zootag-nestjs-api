import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0236-alter-zt_companies-add-createduserid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_Companies',
    'createdUserId',
    'BIGINT',
    false,
    undefined,
    fkConstraint('FK_ZT_Companies_CreatedUserId', 'Users', 'id'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_Companies',
    'createdUserId',
    'FK_ZT_Companies_CreatedUserId',
  );
}
