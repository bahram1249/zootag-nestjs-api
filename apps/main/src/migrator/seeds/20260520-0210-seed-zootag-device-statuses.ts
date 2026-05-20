import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260520-0210-seed-zootag-device-statuses';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top } = createDialectHelpers(sequelize);

  for (const row of [
    { id: 1, title: 'InStock', slug: 'in-stock' },
    { id: 2, title: 'Assigned', slug: 'assigned' },
    { id: 3, title: 'Active', slug: 'active' },
    { id: 4, title: 'Damaged', slug: 'damaged' },
    { id: 5, title: 'Retired', slug: 'retired' },
  ]) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM ZT_DeviceStatuses WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO ZT_DeviceStatuses (id, title, slug, isActive, isDeleted, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.title)}, ${ns(row.slug)}, 1, NULL, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(`DELETE FROM ZT_DeviceStatuses WHERE id IN (1, 2, 3, 4, 5)`, {
    raw: true,
    type: QueryTypes.RAW,
  });
}
