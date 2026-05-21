import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0237-alter-zt_companies-add-updateduserid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_Companies',
    'updatedUserId',
    'BIGINT',
    false,
    undefined,
    fkConstraint('FK_ZT_Companies_UpdatedUserId', 'Users', 'id'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_Companies',
    'updatedUserId',
    'FK_ZT_Companies_UpdatedUserId',
  );
}
