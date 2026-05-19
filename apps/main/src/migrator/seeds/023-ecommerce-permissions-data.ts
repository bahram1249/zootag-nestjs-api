import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export const name = '023-ecommerce-permissions-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (await checkSetting('key', ['SITE_NAME'], 'ecommerce')) {
    await createCrudPermissions(sequelize, {
      entityName: 'Brands',
      groupName: 'ecommerce.brands',
      findParentMenu: true,
      parentMenuName: 'محصول',
      menuName: 'برند ها',
      menuUrl: '/admin/ecommerce/brands',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Colors',
      groupName: 'ecommerce.colors',
      findParentMenu: true,
      parentMenuName: 'محصول',
      menuName: 'رنگ ها',
      menuUrl: '/admin/ecommerce/colors',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Guarantees',
      groupName: 'ecommerce.guarantees',
      findParentMenu: true,
      parentMenuName: 'محصول',
      menuName: 'گارانتی ها',
      menuUrl: '/admin/ecommerce/guarantees',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ProductPhotos',
      groupName: 'ecommerce.productphotos',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Vendors',
      groupName: 'ecommerce.vendors',
      findParentMenu: true,
      parentMenuName: 'محصول',
      menuName: 'فروشندگان',
      menuUrl: '/admin/ecommerce/vendors',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'VendorAddresses',
      groupName: 'ecommerce.vendoraddresses',
      parentMenuName: 'فروشنده',
      menuName: 'آدرس ها',
      menuUrl: '/admin/ecommerce/vendoraddresses',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Products',
      groupName: 'ecommerce.admin.products',
      findParentMenu: true,
      parentMenuName: 'محصول',
      menuName: 'محصولات',
      menuUrl: '/admin/ecommerce/products',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Discounts',
      groupName: 'ecommerce.admin.discounts',
      findParentMenu: true,
      parentMenuName: 'محصول',
      menuName: 'تخفیفات',
      menuUrl: '/admin/ecommerce/discounts',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'DiscountConditions',
      groupName: 'ecommerce.admin.discountconditions',
      findParentMenu: true,
      parentMenuName: 'محصول',
      menuName: 'شرط تخفیف',
      menuUrl: '/admin/ecommerce/discounts',
      includePermissions: ['getall', 'getone', 'create', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Transactions',
      groupName: 'ecommerce.admin.transactions',
      parentMenuName: 'پرداخت و حمل و نقل',
      menuName: 'تراکنش ها',
      menuUrl: '/admin/ecommerce/transactions',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'PostageFees',
      groupName: 'ecommerce.admin.postagefees',
      findParentMenu: true,
      parentMenuName: 'پرداخت و حمل و نقل',
      menuName: 'نرخ پستی',
      menuUrl: '/admin/ecommerce/postageFees',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'PendingOrders',
      groupName: 'ecommerce.admin.pendingorders',
      findParentMenu: true,
      parentMenuName: 'فروشنده',
      menuName: 'سفارشات منتظر پردازش',
      menuUrl: '/admin/ecommerce/pendingOrders',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'PostageOrders',
      groupName: 'ecommerce.admin.postageorders',
      findParentMenu: true,
      parentMenuName: 'فروشنده',
      menuName: 'سفارشات منتظر ارسال به پست',
      menuUrl: '/admin/ecommerce/postageOrders',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'TotalOrders',
      groupName: 'ecommerce.admin.totalorders',
      findParentMenu: true,
      parentMenuName: 'فروشنده',
      menuName: 'همه ی سفارشات',
      menuUrl: '/admin/ecommerce/totalOrders',
      includePermissions: ['showmenu', 'getall', 'getone', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Courier',
      groupName: 'ecommerce.admin.couriers',
      findParentMenu: true,
      parentMenuName: 'پرداخت و حمل و نقل',
      menuName: 'پیک ها',
      menuUrl: '/admin/ecommerce/couriers',
      includePermissions: ['showmenu', 'getall', 'getone', 'create', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'CourierPrice',
      groupName: 'ecommerce.admin.courierprices',
      findParentMenu: true,
      parentMenuName: 'پرداخت و حمل و نقل',
      menuName: 'نرخ پیک',
      menuUrl: '/admin/ecommerce/courierPrices',
      includePermissions: ['showmenu', 'getone', 'update'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'CourierOrders',
      groupName: 'ecommerce.admin.courierorders',
      findParentMenu: true,
      parentMenuName: 'فروشنده',
      menuName: 'سفارشات منتظر ارسال به پیک',
      menuUrl: '/admin/ecommerce/courierOrders',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'DeliveryOrders',
      groupName: 'ecommerce.admin.deliveryorders',
      parentMenuName: 'پیک',
      menuName: 'سفارشات منتظر ارسال به مشتری',
      menuUrl: '/admin/ecommerce/deliveryOrders',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'VariationPrices',
      groupName: 'ecommerce.admin.variationprices',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ReportAdminSales',
      groupName: 'ecommerce.report.adminsales',
      parentMenuName: 'گزارشات',
      menuName: 'میزان فروش و درآمد (ادمین)',
      menuUrl: '/admin/ecommerce/report/adminSales',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ReportVendorSales',
      groupName: 'ecommerce.report.vendorsales',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'میزان فروش و درآمد (فروشنده)',
      menuUrl: '/admin/ecommerce/report/vendorSales',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ReportAdminCouriers',
      groupName: 'ecommerce.report.admincouriers',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'سفارشات پیکی(ادمین)',
      menuUrl: '/admin/ecommerce/report/adminCouriers',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ReportAdminPosts',
      groupName: 'ecommerce.report.adminposts',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'سفارشات پستی(ادمین)',
      menuUrl: '/admin/ecommerce/report/adminPosts',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ReportCouriers',
      groupName: 'ecommerce.report.couriers',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'سفارشات پیکی',
      menuUrl: '/admin/ecommerce/report/couriers',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'PaymentGateways',
      groupName: 'ecommerce.admin.paymentgateways',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'PaymentTransactions',
      groupName: 'ecommerce.report.paymenttransactions',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'کمیسیون درگاه',
      menuUrl: '/admin/ecommerce/report/paymentTransactions',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'InventoriesReport',
      groupName: 'ecommerce.report.inventories',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'آمار موجودی ها',
      menuUrl: '/admin/ecommerce/report/inventories',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'InventoryStatus',
      groupName: 'ecommerce.admin.inventorystatuses',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'EntityTypeFactors',
      groupName: 'ecommerce.admin.entitytypefactors',
      includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ProductComments',
      groupName: 'ecommerce.admin.productcomments',
      parentMenuName: 'کامنت و بازخورد',
      menuName: 'کامنت ها',
      menuUrl: '/admin/ecommerce/productComments',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ProductCommentStatus',
      groupName: 'ecommerce.admin.productcommentstatuses',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'OrderStatus',
      groupName: 'ecommerce.admin.orderstatuses',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'OrderShipmentWays',
      groupName: 'ecommerce.admin.ordershipmentways',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminAddress',
      groupName: 'ecommerce.admin.addresses',
      includePermissions: ['getall', 'getone', 'update'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ReportProductSales',
      groupName: 'ecommerce.report.productsales',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'گزارش تعداد فروش کالا',
      menuUrl: '/admin/ecommerce/report/productSales',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'InventoryHistories',
      groupName: 'ecommerce.admin.inventoryhistories',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Pages',
      groupName: 'ecommerce.admin.pages',
      findParentMenu: true,
      parentMenuName: 'مدیریت',
      menuName: 'صفحات',
      menuUrl: '/admin/ecommerce/pages',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'CancellOrders',
      groupName: 'ecommerce.admin.cancellorders',
      findParentMenu: true,
      parentMenuName: 'فروشنده',
      menuName: 'سفارشات کنسل شده',
      menuUrl: '/admin/ecommerce/cancellOrders',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'HomePages',
      groupName: 'ecommerce.admin.homepages',
      findParentMenu: true,
      parentMenuName: 'مدیریت',
      menuName: 'تنظیمات صفحه اصلی',
      menuUrl: '/admin/ecommerce/homePages',
      includePermissions: ['showmenu', 'getall', 'create'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'HomePagePhotoss',
      groupName: 'ecommerce.homepagephotos',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ProductVideos',
      groupName: 'ecommerce.productvideos',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Notification',
      groupName: 'ecommerce.admin.notifications',
      findParentMenu: true,
      parentMenuName: 'مدیریت',
      menuName: 'اطلاع رسانی',
      menuUrl: '/admin/ecommerce/notifications',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'HeaderNotification',
      groupName: 'ecommerce.admin.headernotifications',
      findParentMenu: true,
      parentMenuName: 'مدیریت',
      menuName: 'اطلاع رسانی بالای سایت',
      menuUrl: '/admin/ecommerce/headerNotifications',
      includePermissions: ['showmenu', 'getall', 'update'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GoldCurrentPrices',
      groupName: 'ecommerce.admin.currentprices',
      findParentMenu: true,
      parentMenuName: 'مدیریت',
      menuName: 'تنظیمات قیمت لحظه ای',
      menuUrl: '/admin/ecommerce/goldCurrentPrices',
      includePermissions: ['showmenu', 'getall', 'update'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'PriceFormulas',
      groupName: 'ecommerce.admin.priceformulas',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'FactorDiscounts',
      groupName: 'ecommerce.admin.factordiscounts',
      findParentMenu: true,
      parentMenuName: 'محصول',
      menuName: 'تخفیف ارسال رایگان',
      menuUrl: '/admin/ecommerce/factorDiscounts',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'SelectedProducts',
      groupName: 'ecommerce.selectedproducts',
      findParentMenu: true,
      parentMenuName: 'محصول',
      menuName: 'دستچین کالا ها',
      menuUrl: '/admin/ecommerce/selectedProducts',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'SelectedProductItems',
      groupName: 'ecommerce.selectedproductsitems',
      includePermissions: ['getall', 'create', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'LinkedEntityTypeBrand',
      groupName: 'ecommerce.admin.linkedentitytypebrands',
      findParentMenu: true,
      parentMenuName: 'محصول',
      menuName: 'صفحه ساز دسته بندی و برندها',
      menuUrl: '/admin/ecommerce/linkedEntityTypeBrands',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'PublicPhotos',
      groupName: 'ecommerce.publicphotos',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Logistic',
      groupName: 'ecommerce.logistics',
      findParentMenu: true,
      parentMenuName: 'پرداخت و حمل و نقل',
      menuName: 'لاجستیک',
      menuUrl: '/admin/ecommerce/logistics',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'LogisticUser',
      groupName: 'ecommerce.logisticusers',
      includePermissions: ['getall', 'create', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'LogisticShipment',
      groupName: 'ecommerce.logisticshipmentways',
      includePermissions: ['getall', 'create'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminLogisticSendingPeriod',
      groupName: 'ecommerce.admin.logisticsendingperiods',
      includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminLogisticWeeklyPeriods',
      groupName: 'ecommerce.admin.logisticweeklyperiods',
      includePermissions: ['getall', 'getone', 'create'],
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(_sequelize: Sequelize): Promise<void> {}
