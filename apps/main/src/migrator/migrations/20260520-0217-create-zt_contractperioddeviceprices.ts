import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0217-create-zt_contractperioddeviceprices';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, ref, bit } = createDialectHelpers(sequelize);

  await createTable('ZT_ContractPeriodDevicePrices', [
    'id BIGINT ' + idCol + ' ' + pk,
    'contractPeriodId BIGINT NOT NULL' + ' ' + ref('ZT_ContractPeriods', 'id', 'ZT_ContractPeriodDevicePrices', 'contractPeriodId'),
    'deviceTypeId BIGINT NOT NULL' + ' ' + ref('ZT_DeviceTypes', 'id', 'ZT_ContractPeriodDevicePrices', 'deviceTypeId'),
    'purchasePrice DECIMAL NULL',
    'currencyId BIGINT NOT NULL' + ' ' + ref('ZT_Currencies', 'id', 'ZT_ContractPeriodDevicePrices', 'currencyId'),
    'purchasePriceIRR DECIMAL NOT NULL',
    'minimumQuantity INT NOT NULL',
    'isActive ' + bit() + ' NOT NULL DEFAULT 1',
    'isDeleted ' + bit() + ' NULL',
    '[createdAt] DATETIME NOT NULL',
    '[updatedAt] DATETIME NOT NULL',
  ].join(',\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_ContractPeriodDevicePrices');
}
