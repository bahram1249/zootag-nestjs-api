import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0243-alter-zt_contracts-add-updateduserid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn('ZT_Contracts', 'updatedUserId', 'BIGINT', false, undefined, fkConstraint('FK_ZT_Contracts_UpdatedUserId', 'Users', 'id'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_Contracts', 'updatedUserId', 'FK_ZT_Contracts_UpdatedUserId');
}
