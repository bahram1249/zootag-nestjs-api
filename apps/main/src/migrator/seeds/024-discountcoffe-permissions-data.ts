import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export const name = '024-discountcoffe-permissions-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (await checkSetting('key', ['SITE_NAME'], 'discountcoffe')) {
    await createCrudPermissions(sequelize, {
      entityName: 'AdminBuffets',
      groupName: 'discountcoffe.admin.buffets',
      parentMenuName: 'کافه و رستوران',
      menuName: 'لیست کافه و رستوران',
      menuUrl: '/discountcoffe/admin/buffets',
      includePermissions: [
        'showmenu',
        'getall',
        'getone',
        'create',
        'update',
        'delete',
        'menu',
      ],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminMenuCategories',
      groupName: 'discountcoffe.admin.menucategories',
      findParentMenu: true,
      parentMenuName: 'کافه و رستوران',
      menuName: 'لیست دسته بندی های منو',
      menuUrl: '/discountcoffe/admin/menucategories',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminDiscountMenus',
      groupName: 'discountcoffe.admin.menus',
      includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminReserves',
      groupName: 'discountcoffe.admin.totalreserves',
      findParentMenu: true,
      parentMenuName: 'کافه و رستوران',
      menuName: 'لیست تمامی سفارش ها',
      menuUrl: '/discountcoffe/admin/totalreserves',
      includePermissions: ['showmenu', 'getall', 'getone', 'update'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'CoffeReserves',
      groupName: 'discountcoffe.admin.reservers',
      findParentMenu: true,
      parentMenuName: 'کافه و رستوران',
      menuName: 'لیست تمامی سفارش ها',
      menuUrl: '/discountcoffe/admin/reservers',
      includePermissions: ['showmenu', 'getall', 'getone', 'update'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminReports',
      groupName: 'discountcoffe.admin.adminreports',
      findParentMenu: true,
      parentMenuName: 'کافه و رستوران',
      menuName: 'گزارش های ادمین',
      menuUrl: '/discountcoffe/admin/adminreports',
      includePermissions: ['showmenu', 'getall', 'getone', 'update'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'CoffeReports',
      groupName: 'discountcoffe.admin.coffereports',
      findParentMenu: true,
      parentMenuName: 'کافه و رستوران',
      menuName: 'گزارش های کافه',
      menuUrl: '/discountcoffe/admin/coffereports',
      includePermissions: ['showmenu', 'getall', 'getone', 'update'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'QrScan',
      groupName: 'discountcoffe.admin.qrscan',
      findParentMenu: true,
      parentMenuName: 'کافه و رستوران',
      menuName: 'اسکن بارکد',
      menuUrl: '/discountcoffe/admin/qrscan',
      includePermissions: ['showmenu'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Holidays',
      groupName: 'discountcoffe.admin.holidays',
      findParentMenu: true,
      parentMenuName: 'کافه و رستوران',
      menuName: 'اعلام روز های تعطیل',
      menuUrl: '/discountcoffe/admin/holidays',
      includePermissions: ['showmenu'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'FactorReport',
      groupName: 'discountcoffe.admin.factorreport',
      findParentMenu: true,
      parentMenuName: 'کافه و رستوران',
      menuName: 'صورت حساب',
      menuUrl: '/discountcoffe/admin/factorReport',
      includePermissions: ['showmenu'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'FactorReport',
      groupName: 'discountcoffe.admin.allfactorreport',
      findParentMenu: true,
      parentMenuName: 'کافه و رستوران',
      menuName: 'صورت حساب ها',
      menuUrl: '/discountcoffe/admin/allFactorReport',
      includePermissions: ['showmenu'],
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(_sequelize: Sequelize): Promise<void> {}
