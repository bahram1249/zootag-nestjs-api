import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260528-0320-seed-fix-pettype-petbreed-menu-urls';

export async function up(sequelize: Sequelize): Promise<void> {
  const { ns } = createDialectHelpers(sequelize);

  await sequelize.query(
    `UPDATE Menus SET url = ${ns('/admin/zootag/pet-types')} WHERE title = ${ns('انواع پت')}`,
    { raw: true, type: QueryTypes.RAW },
  );

  await sequelize.query(
    `UPDATE Menus SET url = ${ns('/admin/zootag/pet-breeds')} WHERE title = ${ns('انواع نژاد')}`,
    { raw: true, type: QueryTypes.RAW },
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { ns } = createDialectHelpers(sequelize);

  await sequelize.query(
    `UPDATE Menus SET url = ${ns('/admin/zootag/petTypes')} WHERE title = ${ns('انواع پت')}`,
    { raw: true, type: QueryTypes.RAW },
  );

  await sequelize.query(
    `UPDATE Menus SET url = ${ns('/admin/zootag/petBreeds')} WHERE title = ${ns('انواع نژاد')}`,
    { raw: true, type: QueryTypes.RAW },
  );
}
