import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260525-0316-alter-zt_marketerdevicesaleprices-drop-devicetypeid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dropColumn } = createDialectHelpers(sequelize);
  await dropColumn('ZT_MarketerDeviceSalePrices', 'deviceTypeId', 'FK_ZT_MarketerDeviceSalePrices_deviceTypeId');
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { addColumn } = createDialectHelpers(sequelize);
  await addColumn('ZT_MarketerDeviceSalePrices', 'deviceTypeId', 'BIGINT', false, undefined, undefined);
}
