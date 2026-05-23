import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0283-seed-zootag-commission-settlement-statuses';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top } = createDialectHelpers(sequelize);

  for (const row of [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Paid' },
    { id: 3, name: 'Cancelled' },
  ]) {
    const [existing]: any = await sequelize.query(
      top(
        1,
        `SELECT 1 FROM ZT_CommissionSettlementStatuses WHERE id = ${row.id}`,
      ),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO ZT_CommissionSettlementStatuses (id, name, isActive, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, 1, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(
    `DELETE FROM ZT_CommissionSettlementStatuses WHERE id IN (1, 2, 3)`,
    {
      raw: true,
      type: QueryTypes.RAW,
    },
  );
}
