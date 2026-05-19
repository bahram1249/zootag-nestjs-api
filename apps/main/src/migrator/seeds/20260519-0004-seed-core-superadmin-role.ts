import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0004-seed-core-superadmin-role';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top, checkSetting } = createDialectHelpers(sequelize);

  const hasSiteName = await checkSetting('key', ['SITE_NAME']);
  if (!hasSiteName) return;

  const [existing]: any = await sequelize.query(
    top(1, `SELECT 1 FROM Roles WHERE static_id = 1`),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!existing) {
    await sequelize.query(
      `INSERT INTO Roles (roleName, static_id, "createdAt", "updatedAt")
       VALUES (${ns('super-admin')}, 1, ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(
    `DELETE FROM Roles WHERE static_id = 1`,
    { raw: true, type: QueryTypes.RAW },
  );
}