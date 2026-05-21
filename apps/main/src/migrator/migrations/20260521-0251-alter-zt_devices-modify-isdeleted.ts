import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0251-alter-zt_devices-modify-isdeleted';

export async function up(sequelize: Sequelize): Promise<void> {
  const { alterColumn, bit } = createDialectHelpers(sequelize);
  await sequelize.query(
    `UPDATE ZT_Devices SET isDeleted = 0 WHERE isDeleted IS NULL`,
    { raw: true, type: QueryTypes.RAW },
  );
  await sequelize.query(
    `ALTER TABLE ZT_Devices ADD CONSTRAINT DF_ZT_Devices_isDeleted DEFAULT 0 FOR isDeleted`,
    { raw: true, type: QueryTypes.RAW },
  );
  await alterColumn('ZT_Devices', 'isDeleted', bit(), false);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { alterColumn, bit } = createDialectHelpers(sequelize);
  await sequelize.query(
    `ALTER TABLE ZT_Devices DROP CONSTRAINT IF EXISTS DF_ZT_Devices_isDeleted`,
    { raw: true, type: QueryTypes.RAW },
  );
  await alterColumn('ZT_Devices', 'isDeleted', bit(), true);
}
