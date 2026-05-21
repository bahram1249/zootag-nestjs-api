import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260521-0250-alter-zt_devicetypes-modify-isdeleted';

export async function up(sequelize: Sequelize): Promise<void> {
  const { alterColumn, bit } = createDialectHelpers(sequelize);
  await sequelize.query(
    `UPDATE ZT_DeviceTypes SET isDeleted = 0 WHERE isDeleted IS NULL`,
    { raw: true, type: QueryTypes.RAW },
  );
  await sequelize.query(
    `ALTER TABLE ZT_DeviceTypes ADD CONSTRAINT DF_ZT_DeviceTypes_isDeleted DEFAULT 0 FOR isDeleted`,
    { raw: true, type: QueryTypes.RAW },
  );
  await alterColumn('ZT_DeviceTypes', 'isDeleted', bit(), false);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { alterColumn, bit } = createDialectHelpers(sequelize);
  await sequelize.query(
    `ALTER TABLE ZT_DeviceTypes DROP CONSTRAINT IF EXISTS DF_ZT_DeviceTypes_isDeleted`,
    { raw: true, type: QueryTypes.RAW },
  );
  await alterColumn('ZT_DeviceTypes', 'isDeleted', bit(), true);
}
