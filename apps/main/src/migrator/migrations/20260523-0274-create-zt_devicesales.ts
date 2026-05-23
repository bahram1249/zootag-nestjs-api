import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0274-create-zt_devicesales';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, ref, text, dt } =
    createDialectHelpers(sequelize);

  await createTable(
    'ZT_DeviceSales',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'deviceId BIGINT NOT NULL' +
        ' ' +
        ref('ZT_Devices', 'id', 'ZT_DeviceSales', 'deviceId'),
      'marketerId BIGINT NOT NULL' +
        ' ' +
        ref('ZT_Marketers', 'id', 'ZT_DeviceSales', 'marketerId'),
      'customerCompanyId BIGINT NULL' +
        ' ' +
        ref('ZT_Companies', 'id', 'ZT_DeviceSales', 'customerCompanyId'),
      'saleDate DATETIME NOT NULL',
      'salePrice DECIMAL(18, 2) NOT NULL',
      'saleCurrencyId BIGINT NOT NULL' +
        ' ' +
        ref('ZT_Currencies', 'id', 'ZT_DeviceSales', 'saleCurrencyId'),
      'salePriceIRR DECIMAL(18, 2) NOT NULL',
      'purchasePriceIRR DECIMAL(18, 2) NOT NULL',
      'grossProfitIRR DECIMAL(18, 2) NOT NULL',
      'commissionTypeId BIGINT NOT NULL' +
        ' ' +
        ref('ZT_CommissionTypes', 'id', 'ZT_DeviceSales', 'commissionTypeId'),
      'commissionValue DECIMAL(18, 2) NOT NULL',
      'commissionAmountIRR DECIMAL(18, 2) NOT NULL',
      'netProfitIRR DECIMAL(18, 2) NOT NULL',
      'notes ' + text() + ' NULL',
      'createdUserId BIGINT NOT NULL' +
        ' ' +
        ref('Users', 'id', 'ZT_DeviceSales', 'createdUserId'),
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_DeviceSales');
}
