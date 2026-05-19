import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export const name = '025-gs-permissions-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (await checkSetting('key', ['SITE_NAME'], 'guarantee')) {
    await createCrudPermissions(sequelize, {
      entityName: 'Brands',
      groupName: 'gs.admin.brands',
      parentMenuName: 'اطلاعات پایه گارانتی',
      menuName: 'برند ها',
      menuUrl: '/admin/gs/brands',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'ProductTypes',
      groupName: 'gs.admin.producttypes',
      findParentMenu: true,
      parentMenuName: 'اطلاعات پایه گارانتی',
      menuName: 'انواع محصول',
      menuUrl: '/admin/gs/productTypes',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'NormalGuarantee',
      groupName: 'gs.admin.noramlguarantees',
      findParentMenu: true,
      parentMenuName: 'اطلاعات پایه گارانتی',
      menuName: 'کارت گارانتی های عادی',
      menuUrl: '/admin/gs/normalGuarantee',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Varaint',
      groupName: 'gs.admin.variants',
      findParentMenu: true,
      parentMenuName: 'اطلاعات پایه گارانتی',
      menuName: 'مدل دستگاه ها',
      menuUrl: '/admin/gs/variants',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeOrganizations',
      groupName: 'gs.admin.guaranteeorganizations',
      findParentMenu: true,
      parentMenuName: 'اطلاعات پایه گارانتی',
      menuName: 'نمایندگان',
      menuUrl: '/admin/gs/guaranteeOrganizations',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeOrganizationContracts',
      groupName: 'gs.admin.guaranteeorganizationcontracts',
      includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeAdditionalPackages',
      groupName: 'gs.admin.additionalpackages',
      findParentMenu: true,
      parentMenuName: 'اطلاعات پایه گارانتی',
      menuName: 'شرایط مازاد گارانتی',
      menuUrl: '/admin/gs/additionalPackages',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeCartables',
      groupName: 'gs.admin.cartables',
      parentMenuName: 'عملیات',
      menuName: 'کارتابل',
      menuUrl: '/admin/gs/cartables',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeSolutions',
      groupName: 'gs.admin.solutions',
      findParentMenu: true,
      parentMenuName: 'اطلاعات پایه گارانتی',
      menuName: 'خدمات',
      menuUrl: '/admin/gs/solutions',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeTechnicalPersons',
      groupName: 'gs.admin.technicalpersons',
      findParentMenu: true,
      parentMenuName: 'عملیات',
      menuName: 'تکنسین ها',
      menuUrl: '/admin/gs/technicalPersons',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeVipBundleType',
      groupName: 'gs.admin.vipbundletypes',
      findParentMenu: true,
      parentMenuName: 'اطلاعات پایه گارانتی',
      menuName: 'انواع کارت های گارانتی',
      menuUrl: '/admin/gs/vipBundleTypes',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Factors',
      groupName: 'gs.admin.factors',
      findParentMenu: true,
      parentMenuName: 'عملیات',
      menuName: 'فاکتور ها',
      menuUrl: '/admin/gs/factors',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeVipGenerators',
      groupName: 'gs.admin.vipgenerators',
      findParentMenu: true,
      parentMenuName: 'اطلاعات پایه گارانتی',
      menuName: 'صددور کارت گارانتی وی آی پی',
      menuUrl: '/admin/gs/vipGenerators',
      includePermissions: ['showmenu', 'getall', 'getone', 'create'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeTrackingRequests',
      groupName: 'gs.admin.trackingrequests',
      findParentMenu: true,
      parentMenuName: 'عملیات',
      menuName: 'پیگیری درخواست',
      menuUrl: '/admin/gs/trackingRequests',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeSuperVisors',
      groupName: 'gs.admin.supervisorusers',
      findParentMenu: true,
      parentMenuName: 'عملیات',
      menuName: 'ناظر ها',
      menuUrl: '/admin/gs/superVisorUsers',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeResponse',
      groupName: 'gs.admin.response',
      parentMenuName: 'گزارشات',
      menuName: 'نظر سنجی ها',
      menuUrl: '/admin/gs/surveys',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeSupplierPersons',
      groupName: 'gs.admin.supplierpersons',
      findParentMenu: true,
      parentMenuName: 'عملیات',
      menuName: 'تامین کنندگان',
      menuUrl: '/admin/gs/supplierPersons',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteePreRegistrationOrganizations',
      groupName: 'gs.admin.preregistrationorganizations',
      findParentMenu: true,
      parentMenuName: 'عملیات',
      menuName: 'لیست ثبت نام نمایندگان',
      menuUrl: '/admin/gs/preRegistrationOrganizations',
      includePermissions: ['showmenu', 'getall', 'getone', 'update', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeIncomeReports',
      groupName: 'gs.report.incomereports',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'گزارش درآمدی',
      menuUrl: '/admin/gs/incomeReports',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeSubscriptions',
      groupName: 'gs.admin.subscriptions',
      parentMenuName: 'باشگاه مشتریان',
      menuName: 'لیست ثبت نام',
      menuUrl: '/admin/gs/subscriptions',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Faqs',
      groupName: 'gs.admin.faqs',
      findParentMenu: true,
      parentMenuName: 'مدیریت',
      menuName: 'سوالات متداول',
      menuUrl: '/admin/gs/faqs',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeUserActionReports',
      groupName: 'gs.report.useractionreports',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'گزارش عملکرد کاربران',
      menuUrl: '/admin/gs/userActionReports',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeActivityReports',
      groupName: 'gs.report.activityreports',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'گزارش فعالیت ها',
      menuUrl: '/admin/gs/activityReports',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeSupplierReports',
      groupName: 'gs.report.supplierreports',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'گزارش تامین کنندگان',
      menuUrl: '/admin/gs/supplierReports',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeTechnicalPersonReports',
      groupName: 'gs.report.technicalpersonreports',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'گزارش افراد فنی',
      menuUrl: '/admin/gs/technicalPersonReports',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'DiscountCode',
      groupName: 'gs.admin.discountcodes',
      parentMenuName: 'تخفیف',
      menuName: 'کدهای تخفیف',
      menuUrl: '/admin/gs/discountCodes',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'RewardRule',
      groupName: 'gs.admin.rewardrules',
      findParentMenu: true,
      parentMenuName: 'تخفیف',
      menuName: 'قوانین پاداش',
      menuUrl: '/admin/gs/rewardRules',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeDiscountCodeUsages',
      groupName: 'gs.report.discountcodeusages',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'گزارش استفاده از کد تخفیف',
      menuUrl: '/admin/gs/discountCodeUsages',
      includePermissions: ['showmenu', 'getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'GuaranteeRewardHistories',
      groupName: 'gs.report.rewardhistories',
      findParentMenu: true,
      parentMenuName: 'گزارشات',
      menuName: 'تاریخچه پاداش',
      menuUrl: '/guarantee/report/rewardHistories',
      includePermissions: ['showmenu', 'getall'],
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(_sequelize: Sequelize): Promise<void> {}
