import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0240-alter-zt_contractperiods-add-createduserid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_ContractPeriods',
    'createdUserId',
    'BIGINT',
    false,
    undefined,
    fkConstraint('FK_ZT_ContractPeriods_CreatedUserId', 'Users', 'id'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_ContractPeriods',
    'createdUserId',
    'FK_ZT_ContractPeriods_CreatedUserId',
  );
}
