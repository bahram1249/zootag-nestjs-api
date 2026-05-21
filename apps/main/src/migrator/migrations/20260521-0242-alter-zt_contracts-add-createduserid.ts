import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0242-alter-zt_contracts-add-createduserid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn('ZT_Contracts', 'createdUserId', 'BIGINT', false, undefined, fkConstraint('FK_ZT_Contracts_CreatedUserId', 'Users', 'id'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_Contracts', 'createdUserId', 'FK_ZT_Contracts_CreatedUserId');
}
