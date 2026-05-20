import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0198-create-coresessions';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, ref, nv, bit, dt } = createDialectHelpers(sequelize);

  await createTable('CoreSessions', [
    'id BIGINT ' + idCol + ' ' + pk,
    'userId BIGINT NOT NULL' + ' ' + ref('Users', 'id', 'CoreSessions', 'userId'),
    'refreshToken ' + nv('255') + ' NOT NULL',
    'ipAddress ' + nv('255') + ' NULL',
    'userAgent ' + nv('255') + ' NULL',
    'expiresAt DATE NOT NULL',
    'isRevoked ' + bit() + ' NOT NULL DEFAULT 0',
    'lastActivityAt DATE NULL',
    '[createdAt] ' + dt(),
    '[updatedAt] ' + dt(),
  ].join(',\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('CoreSessions');
}
