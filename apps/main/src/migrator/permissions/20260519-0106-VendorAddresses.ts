export const name = '20260519-0106-VendorAddresses';
import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'VendorAddresses',
    groupName: 'ecommerce.vendoraddresses',
    parentMenuName: 'فروشنده',
    parentIcon: 'store',
    menuName: 'آدرس ها',
    menuUrl: '/admin/ecommerce/vendoraddresses',
    icon: 'circle',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}
