import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260523-0284-seed-zootag-inventory-statuses';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top } = createDialectHelpers(sequelize);

  for (const row of [
    { id: 1, name: 'Available' },
    { id: 2, name: 'Reserved' },
    { id: 3, name: 'Sold' },
    { id: 4, name: 'Returned' },
    { id: 5, name: 'Damaged' },
  ]) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM ZT_InventoryStatuses WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO ZT_InventoryStatuses (id, name, isActive, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, 1, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(
    `DELETE FROM ZT_InventoryStatuses WHERE id IN (1, 2, 3, 4, 5)`,
    {
      raw: true,
      type: QueryTypes.RAW,
    },
  );
}
