import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name =
  '20260522-0263-alter-zt_devices-add-contractperioddevicepriceid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_Devices',
    'contractPeriodDevicePriceId',
    'BIGINT',
    false,
    undefined,
    fkConstraint(
      'FK_ZT_Devices_ContractPeriodDevicePriceId',
      'ZT_ContractPeriodDevicePrices',
      'id',
    ),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_Devices',
    'contractPeriodDevicePriceId',
    'FK_ZT_Devices_ContractPeriodDevicePriceId',
  );
}
