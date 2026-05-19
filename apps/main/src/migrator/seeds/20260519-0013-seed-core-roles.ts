import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0013-seed-core-roles';
export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top, checkSetting } = createDialectHelpers(sequelize);
  if (!await checkSetting('key', ['SITE_NAME'])) return;

  const roles = [
    { static_id: 2, roleName: 'فروشنده' },
    { static_id: 3, roleName: 'پیک' },
    { static_id: 8, roleName: 'لاجستیک' },
  ];

  for (const role of roles) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM Roles WHERE static_id = ${role.static_id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO Roles (roleName, static_id, "createdAt", "updatedAt")
         VALUES (${ns(role.roleName)}, ${role.static_id}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}
export async function down(_sequelize: Sequelize): Promise<void> {}