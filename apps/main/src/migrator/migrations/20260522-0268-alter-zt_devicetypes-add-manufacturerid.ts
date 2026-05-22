import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260522-0268-alter-zt_devicetypes-add-manufacturerid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { addColumn, fkConstraint } = createDialectHelpers(sequelize);
  await addColumn(
    'ZT_DeviceTypes',
    'manufacturerId',
    'BIGINT',
    true,
    undefined,
    fkConstraint('FK_ZT_DeviceTypes_ManufacturerId', 'ZT_Manufacturers', 'id'),
  );
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn(
    'ZT_DeviceTypes',
    'manufacturerId',
    'FK_ZT_DeviceTypes_ManufacturerId',
  );
}
