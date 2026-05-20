import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0223-seed-zootag-contract-statuses';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top } = createDialectHelpers(sequelize);

  for (const row of [
    { id: 1, name: 'Draft' },
    { id: 2, name: 'Active' },
    { id: 3, name: 'Expired' },
    { id: 4, name: 'Cancelled' },
  ]) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM ZT_ContractStatuses WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO ZT_ContractStatuses (id, name, isActive, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, 1, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(`DELETE FROM ZT_ContractStatuses WHERE id IN (1, 2, 3, 4)`, {
    raw: true,
    type: QueryTypes.RAW,
  });
}
