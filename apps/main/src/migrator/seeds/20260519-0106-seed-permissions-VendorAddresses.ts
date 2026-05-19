import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';

export const name = '20260519-0106-seed-permissions-VendorAddresses';
export async function up(sequelize: Sequelize): Promise<void> {
  await createCrudPermissions(sequelize, {
    entityName: 'VendorAddresses',
    groupName: 'ecommerce.vendoraddresses',
    parentMenuName: 'فروشنده',
    menuName: 'آدرس ها',
    menuUrl: '/admin/ecommerce/vendoraddresses',
  });
}
export async function down(_sequelize: Sequelize): Promise<void> {}

