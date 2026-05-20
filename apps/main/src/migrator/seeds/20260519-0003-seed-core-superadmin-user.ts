import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0003-seed-core-superadmin-user';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top, checkSetting } = createDialectHelpers(sequelize);

  const hasSiteName = await checkSetting('key', ['SITE_NAME']);
  if (!hasSiteName) return;

  const [existing]: any = await sequelize.query(
    top(1, `SELECT 1 FROM Users WHERE static_id = 1`),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!existing) {
    await sequelize.query(
      `INSERT INTO Users (firstname, lastname, email, username, "password", phoneNumber, mustChangePassword, lastPasswordChangeDate, static_id, "createdAt", "updatedAt")
       VALUES (${ns('bahram')}, ${ns('rajabi')}, NULL, 'super-admin', '$2b$10$dfyoOL/K4XRHmhR.8qgNXuBUeMY7Hivd4XoUsqg418SkhFXfWib6q', '09213972466', 0, ${nowVal}, 1, ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(`DELETE FROM Users WHERE static_id = 1`, {
    raw: true,
    type: QueryTypes.RAW,
  });
}
