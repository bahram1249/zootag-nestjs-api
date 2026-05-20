import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0204-create-zt_companies';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, nv, text, bit } =
    createDialectHelpers(sequelize);

  await createTable(
    'ZT_Companies',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'companyName ' + nv('200') + ' NOT NULL',
      'legalName ' + nv('200') + ' NOT NULL',
      'taxNumber ' + nv('100') + ' NULL',
      'email ' + nv('200') + ' NULL',
      'phone ' + nv('50') + ' NULL',
      'address ' + text() + ' NULL',
      'isActive ' + bit() + ' NOT NULL DEFAULT 1',
      'isDeleted ' + bit() + ' NULL',
      '[createdAt] DATETIME NOT NULL',
      '[updatedAt] DATETIME NOT NULL',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_Companies');
}
