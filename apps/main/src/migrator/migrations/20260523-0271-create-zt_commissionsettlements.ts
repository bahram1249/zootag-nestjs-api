import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0271-create-zt_commissionsettlements';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, ref, text, dt } =
    createDialectHelpers(sequelize);

  await createTable(
    'ZT_CommissionSettlements',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'marketerId BIGINT NOT NULL' +
        ' ' +
        ref('ZT_Marketers', 'id', 'ZT_CommissionSettlements', 'marketerId'),
      'deviceSaleId BIGINT NOT NULL' +
        ' ' +
        ref('ZT_DeviceSales', 'id', 'ZT_CommissionSettlements', 'deviceSaleId'),
      'amountIRR DECIMAL(18, 2) NOT NULL',
      'paymentDate DATETIME NOT NULL',
      'statusId BIGINT NOT NULL' +
        ' ' +
        ref(
          'ZT_CommissionSettlementStatuses',
          'id',
          'ZT_CommissionSettlements',
          'statusId',
        ),
      'notes ' + text() + ' NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_CommissionSettlements');
}
