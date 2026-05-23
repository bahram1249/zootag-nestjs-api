import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0273-create-zt_devicesaleprices';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, ref, bit, dt } =
    createDialectHelpers(sequelize);

  await createTable(
    'ZT_DeviceSalePrices',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'deviceTypeId BIGINT NOT NULL' +
        ' ' +
        ref('ZT_DeviceTypes', 'id', 'ZT_DeviceSalePrices', 'deviceTypeId'),
      'companyId BIGINT NULL' +
        ' ' +
        ref('ZT_Companies', 'id', 'ZT_DeviceSalePrices', 'companyId'),
      'contractPeriodId BIGINT NULL' +
        ' ' +
        ref(
          'ZT_ContractPeriods',
          'id',
          'ZT_DeviceSalePrices',
          'contractPeriodId',
        ),
      'currencyId BIGINT NOT NULL' +
        ' ' +
        ref('ZT_Currencies', 'id', 'ZT_DeviceSalePrices', 'currencyId'),
      'salePrice DECIMAL(18, 2) NOT NULL',
      'salePriceIRR DECIMAL(18, 2) NOT NULL',
      'validFrom DATETIME NOT NULL',
      'validTo DATETIME NULL',
      'isActive ' + bit() + ' NOT NULL DEFAULT 1',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_DeviceSalePrices');
}
