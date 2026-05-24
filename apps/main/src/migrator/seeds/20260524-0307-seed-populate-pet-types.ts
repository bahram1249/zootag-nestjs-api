import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260524-0307-seed-populate-pet-types';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top } = createDialectHelpers(sequelize);
  for (const row of [
    { id: 1, name: 'DOG' },
    { id: 2, name: 'CAT' }
  ]) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM ZT_PetTypes WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO ZT_PetTypes (id, name, isActive, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, 1, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  // TODO: revert seed
  // await sequelize.query(`DELETE FROM SomeTable WHERE id IN (...)`, {
  //   raw: true,
  //   type: QueryTypes.RAW,
  // });
}
