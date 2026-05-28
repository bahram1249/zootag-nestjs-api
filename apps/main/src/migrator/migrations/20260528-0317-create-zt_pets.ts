import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260528-0317-create-zt_pets';

export async function up(sequelize: Sequelize): Promise<void> {
  const { createTable, idCol, pk, nv, ref, bit } =
    createDialectHelpers(sequelize);

  await createTable(
    'ZT_Pets',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      'name ' + nv('200') + ' NOT NULL',
      'ownerId BIGINT NOT NULL' +
        ' ' +
        ref('Users', 'id', 'ZT_Pets', 'ownerId'),
      'breedId BIGINT NULL' +
        ' ' +
        ref('ZT_PetBreeds', 'id', 'ZT_Pets', 'breedId'),
      'petTypeId BIGINT NOT NULL' +
        ' ' +
        ref('ZT_PetTypes', 'id', 'ZT_Pets', 'petTypeId'),
      'birthDate DATE NULL',
      'isActive ' + bit() + ' NOT NULL DEFAULT 1',
      'isDeleted ' + bit() + ' NOT NULL DEFAULT 0',
      'createdUserId BIGINT NOT NULL' +
        ' ' +
        ref('Users', 'id', 'ZT_Pets', 'createdUserId'),
      'updatedUserId BIGINT NOT NULL' +
        ' ' +
        ref('Users', 'id', 'ZT_Pets', 'updatedUserId'),
      '[createdAt] DATETIME NOT NULL',
      '[updatedAt] DATETIME NOT NULL',
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('ZT_Pets');
}
