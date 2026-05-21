import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name =
  '20260521-0238-alter-zt_contractperioddeviceprices-add-createduserid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_ContractPeriodDevicePrices',
    'createdUserId',
    'BIGINT',
    false,
    undefined,
    fkConstraint(
      'FK_ZT_ContractPeriodDevicePrices_CreatedUserId',
      'Users',
      'id',
    ),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_ContractPeriodDevicePrices',
    'createdUserId',
    'FK_ZT_ContractPeriodDevicePrices_CreatedUserId',
  );
}
