import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0002-seed-core-usertypes';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top, checkSetting } = createDialectHelpers(sequelize);

  const hasSiteName = await checkSetting('key', ['SITE_NAME']);
  if (!hasSiteName) return;

  for (const ut of [
    { id: 1, title: 'حقیقی' },
    { id: 2, title: 'حقوقی' },
  ]) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM UserTypes WHERE id = ${ut.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO UserTypes (id, title, "createdAt", "updatedAt")
         VALUES (${ut.id}, ${ns(ut.title)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(`DELETE FROM UserTypes WHERE id IN (1, 2)`, {
    raw: true,
    type: QueryTypes.RAW,
  });
}
