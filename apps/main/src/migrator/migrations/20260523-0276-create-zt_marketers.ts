import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0276-create-zt_marketers';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, nv, ref, bit } =
    createDialectHelpers(sequelize);

  await createTable(
    'ZT_Marketers',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'fullName ' + nv('200') + ' NOT NULL',
      'mobile ' + nv('20') + ' NULL',
      'email ' + nv('200') + ' NULL',
      'nationalCode ' + nv('20') + ' NULL',
      'defaultCommissionTypeId BIGINT NULL' +
        ' ' +
        ref(
          'ZT_CommissionTypes',
          'id',
          'ZT_Marketers',
          'defaultCommissionTypeId',
        ),
      'defaultCommissionValue DECIMAL(18, 2) NULL',
      'isActive ' + bit() + ' NOT NULL DEFAULT 1',
      'isDeleted ' + bit() + ' NOT NULL DEFAULT 0',
      'createdUserId BIGINT NOT NULL' +
        ' ' +
        ref('Users', 'id', 'ZT_Marketers', 'createdUserId'),
      'updatedUserId BIGINT NOT NULL' +
        ' ' +
        ref('Users', 'id', 'ZT_Marketers', 'updatedUserId'),
      '[createdAt] DATETIME NOT NULL',
      '[updatedAt] DATETIME NOT NULL',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_Marketers');
}
