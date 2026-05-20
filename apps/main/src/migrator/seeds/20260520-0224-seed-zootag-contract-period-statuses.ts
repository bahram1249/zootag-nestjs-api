import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0224-seed-zootag-contract-period-statuses';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top } = createDialectHelpers(sequelize);

  for (const row of [
    { id: 1, name: 'Future' },
    { id: 2, name: 'Active' },
    { id: 3, name: 'Expired' },
  ]) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM ZT_ContractPeriodStatuses WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO ZT_ContractPeriodStatuses (id, name, isActive, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, 1, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(`DELETE FROM ZT_ContractPeriodStatuses WHERE id IN (1, 2, 3)`, {
    raw: true,
    type: QueryTypes.RAW,
  });
}
