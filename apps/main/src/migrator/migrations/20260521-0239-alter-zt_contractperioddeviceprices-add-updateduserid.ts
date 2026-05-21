import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name =
  '20260521-0239-alter-zt_contractperioddeviceprices-add-updateduserid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_ContractPeriodDevicePrices',
    'updatedUserId',
    'BIGINT',
    false,
    undefined,
    fkConstraint(
      'FK_ZT_ContractPeriodDevicePrices_UpdatedUserId',
      'Users',
      'id',
    ),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_ContractPeriodDevicePrices',
    'updatedUserId',
    'FK_ZT_ContractPeriodDevicePrices_UpdatedUserId',
  );
}
