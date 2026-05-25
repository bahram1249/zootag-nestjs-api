import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260525-0310-alter-zt_devicesales-modify-commissiontypeid';

export async function up(sequelize: Sequelize): Promise<void> {
  const { alterColumn } = createDialectHelpers(sequelize);
  await alterColumn('ZT_DeviceSales', 'commissionTypeId', 'BIGINT', true);
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { alterColumn } = createDialectHelpers(sequelize);
  await alterColumn('ZT_DeviceSales', 'commissionTypeId', 'BIGINT', true);
}
