import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0233-create-zt_devices';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, nv, ref, bit } = createDialectHelpers(sequelize);

  await createTable('ZT_Devices', [
    'id BIGINT ' + idCol + ' ' + pk,
    'serialNumber ' + nv('200') + ' NOT NULL',
    'imei ' + nv('100') + ' NULL',
    'macAddress ' + nv('100') + ' NULL',
    'companyId BIGINT NOT NULL' + ' ' + ref('ZT_Companies', 'id', 'ZT_Devices', 'companyId'),
    'deviceTypeId BIGINT NOT NULL' + ' ' + ref('ZT_DeviceTypes', 'id', 'ZT_Devices', 'deviceTypeId'),
    'contractPeriodId BIGINT NOT NULL' + ' ' + ref('ZT_ContractPeriods', 'id', 'ZT_Devices', 'contractPeriodId'),
    'purchasePrice DECIMAL NULL',
    'currencyId BIGINT NOT NULL' + ' ' + ref('ZT_Currencies', 'id', 'ZT_Devices', 'currencyId'),
    'purchasePriceIRR DECIMAL NOT NULL',
    'purchaseDate DATETIME NULL',
    'warrantyEndDate DATETIME NOT NULL',
    'deviceStatusId BIGINT NOT NULL' + ' ' + ref('ZT_DeviceStatuses', 'id', 'ZT_Devices', 'deviceStatusId'),
    'isActive ' + bit() + ' NOT NULL DEFAULT 1',
    'isDeleted ' + bit() + ' NULL',
    '[createdAt] DATETIME NOT NULL',
    '[updatedAt] DATETIME NOT NULL',
  ].join(',\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_Devices');
}
