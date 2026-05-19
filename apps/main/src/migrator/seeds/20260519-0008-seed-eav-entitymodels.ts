import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0008-seed-eav-entitymodels';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top} = createDialectHelpers(sequelize);


  for (const row of [
    { id: 1, name: 'فروشگاه' },
    { id: 2, name: 'وبلاگ' },
  ]) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM EAVEntityModels WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO EAVEntityModels (id, name, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(
    `DELETE FROM EAVEntityModels WHERE id IN (1, 2)`,
    { raw: true, type: QueryTypes.RAW },
  );
}