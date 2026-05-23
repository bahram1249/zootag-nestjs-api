export const name = '20260523-0286-ZootagDeviceSalePrices';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagDeviceSalePrices',
    groupName: 'zootag.admin.devicetaleprices',
    findParentMenu: true,
    parentMenuName: 'اطلاعات پایه',
    menuName: 'قیمت‌های فروش دستگاه',
    menuUrl: '/admin/zootag/device-sale-prices',
  });
}
export async function down(): Promise<void> {}
