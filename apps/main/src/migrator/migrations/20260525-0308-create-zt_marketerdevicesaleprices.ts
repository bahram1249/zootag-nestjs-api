import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260525-0308-create-zt_marketerdevicesaleprices';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, ref, bit, dt } = createDialectHelpers(sequelize);

  await createTable('ZT_MarketerDeviceSalePrices', [
    'id BIGINT ' + idCol + ' ' + pk,
    'marketerId BIGINT NOT NULL' + ' ' + ref('ZT_Marketers', 'id', 'ZT_MarketerDeviceSalePrices', 'marketerId'),
    'deviceTypeId BIGINT NOT NULL' + ' ' + ref('ZT_DeviceTypes', 'id', 'ZT_MarketerDeviceSalePrices', 'deviceTypeId'),
    'currencyId BIGINT NOT NULL' + ' ' + ref('ZT_Currencies', 'id', 'ZT_MarketerDeviceSalePrices', 'currencyId'),
    'salePrice DECIMAL(18, 2) NOT NULL',
    'salePriceIRR DECIMAL(18, 2) NOT NULL',
    'validFrom DATETIME NOT NULL',
    'validTo DATETIME NULL',
    'isActive ' + bit() + ' NOT NULL DEFAULT 1',
    '[createdAt] ' + dt(),
    '[updatedAt] ' + dt(),
  ].join(',\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_MarketerDeviceSalePrices');
}
