export const name = '20260524-0295-ZootagDeviceSalePrices';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagDeviceSalePrices',
    groupName: 'zootag.admin.devicesaleprices',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه',
    menuName: 'قیمت‌های فروش دستگاه',
    menuUrl: '/admin/zootag/device-sale-prices',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
