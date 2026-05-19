import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0028-eav-create-entitytypes-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { idCol, pk, nv, ref, bit, dt, createTable } =
    createDialectHelpers(sequelize);

  await createTable(
    'EAVEntityTypes',
    [
      'id INT ' + idCol + ' ' + pk,
      'name ' + nv('256') + ' NOT NULL',
      'slug ' + nv('512') + ' NOT NULL',
      'entityModelId INT NOT NULL ' +
        ref('EAVEntityModels', 'id', 'EAVEntityTypes', 'entityModelId'),
      'parentEntityTypeId INT NULL ' +
        ref('EAVEntityTypes', 'id', 'EAVEntityTypes', 'parentEntityTypeId'),
      'isDeleted ' + bit() + ' NULL',
      '"createdAt" ' + dt(),
      '"updatedAt" ' + dt(),
    ].join(',\n'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('EAVEntityTypes');
}
