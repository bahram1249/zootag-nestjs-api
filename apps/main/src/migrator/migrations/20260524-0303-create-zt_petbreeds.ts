import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260524-0303-create-zt_petbreeds';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, nv, ref, bit, dt } = createDialectHelpers(sequelize);

  await createTable('ZT_PetBreeds', [
    'id BIGINT ' + idCol + ' ' + pk,
    'name ' + nv('50') + ' NOT NULL',
    'petTypeId BIGINT NOT NULL' + ' ' + ref('ZT_PetTypes', 'id', 'ZT_PetBreeds', 'petTypeId'),
    'isActive ' + bit() + ' NOT NULL DEFAULT 1',
    '[createdAt] DATETIME NOT NULL',
    '[updatedAt] ' + dt(),
  ].join(',\n'));
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_PetBreeds');
}
