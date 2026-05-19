import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0076-seed-core-superadmin-userrole';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, top, checkSetting } = createDialectHelpers(sequelize);

  const hasSiteName = await checkSetting('key', ['SITE_NAME']);
  if (!hasSiteName) return;

  const [existing]: any = await sequelize.query(
    top(
      1,
      `SELECT 1 FROM UserRoles WHERE userId = (SELECT id FROM Users WHERE static_id = 1) AND roleId = (SELECT id FROM Roles WHERE static_id = 1)`,
    ),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!existing) {
    await sequelize.query(
      `INSERT INTO UserRoles (userId, roleId, "createdAt", "updatedAt")
       VALUES ((SELECT id FROM Users WHERE static_id = 1), (SELECT id FROM Roles WHERE static_id = 1), ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(
    `DELETE FROM UserRoles WHERE userId = (SELECT id FROM Users WHERE static_id = 1) AND roleId = (SELECT id FROM Roles WHERE static_id = 1)`,
    { raw: true, type: QueryTypes.RAW },
  );
}
