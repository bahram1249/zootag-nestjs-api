export const name = '20260524-0296-ZootagDeviceSales';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'ZootagDeviceSales',
    groupName: 'zootag.admin.devicesales',
    findParentMenu: true,
    parentMenuName: 'مالی و فروش',
    menuName: 'فروش دستگاه‌ها',
    menuUrl: '/admin/zootag/device-sales',
    icon: 'shopping-cart',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
