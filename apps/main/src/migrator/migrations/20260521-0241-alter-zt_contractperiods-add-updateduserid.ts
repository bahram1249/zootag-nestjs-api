import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0241-alter-zt_contractperiods-add-updateduserid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_ContractPeriods',
    'updatedUserId',
    'BIGINT',
    false,
    undefined,
    fkConstraint('FK_ZT_ContractPeriods_UpdatedUserId', 'Users', 'id'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_ContractPeriods',
    'updatedUserId',
    'FK_ZT_ContractPeriods_UpdatedUserId',
  );
}
