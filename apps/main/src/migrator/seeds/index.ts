import * as s0001 from './20260519-0001-seed-core-settings';
import * as s0002 from './20260519-0002-seed-core-usertypes';
import * as s0003 from './20260519-0003-seed-core-superadmin-user';
import * as s0004 from './20260519-0004-seed-core-superadmin-role';
import * as s0005 from './20260519-0005-seed-core-superadmin-userrole';
import * as s0006 from './20260519-0006-seed-core-attachmenttypes';
import * as s0007 from './20260519-0007-seed-eav-attributetypes';
import * as s0008 from './20260519-0008-seed-eav-entitymodels';
import * as s0009 from './20260519-0009-seed-eav-blogpublishes';
import * as s0010 from './20260519-0010-seed-bpmn-conditiontypes';
import * as s0011 from './20260519-0011-seed-bpmn-activitytypes';
import * as s0012 from './20260519-0012-seed-bpmn-actiontypes';
import * as s0013 from './20260519-0013-seed-core-roles';
import * as s0014 from '../permissions/20260519-0001-AdminUsers';
import * as s0015 from '../permissions/20260519-0002-AdminRoles';
import * as s0016 from '../permissions/20260519-0003-AdminPermissions';
import * as s0017 from '../permissions/20260519-0004-AdminMenus';
import * as s0018 from '../permissions/20260519-0005-AdminPermissionGroups';
import * as s0019 from '../permissions/20260519-0006-PeriodTypeGroups';
import * as s0020 from '../permissions/20260519-0007-AgeGroups';
import * as s0021 from '../permissions/20260519-0008-PublishesGroups';
import * as s0022 from '../permissions/20260519-0009-EntityTypes';
import * as s0023 from '../permissions/20260519-0010-EntityModels';
import * as s0024 from '../permissions/20260519-0011-AttributeTypes';
import * as s0025 from '../permissions/20260519-0012-Attributes';
import * as s0026 from '../permissions/20260519-0013-AttributeValues';
import * as s0027 from '../permissions/20260519-0014-BlogPublishes';
import * as s0028 from '../permissions/20260519-0015-BlogEntityTypes';
import * as s0029 from '../permissions/20260519-0016-Posts';
import * as s0030 from '../permissions/20260519-0017-Brands';
import * as s0031 from '../permissions/20260519-0018-Colors';
import * as s0032 from '../permissions/20260519-0019-Guarantees';
import * as s0033 from '../permissions/20260519-0020-ProductPhotos';
import * as s0034 from '../permissions/20260519-0021-Vendors';
import * as s0035 from '../permissions/20260519-0022-VendorAddresses';
import * as s0036 from '../permissions/20260519-0023-Products';
import * as s0037 from '../permissions/20260519-0024-Discounts';
import * as s0038 from '../permissions/20260519-0025-DiscountConditions';
import * as s0039 from '../permissions/20260519-0026-Transactions';
import * as s0040 from '../permissions/20260519-0027-PostageFees';
import * as s0041 from '../permissions/20260519-0028-PendingOrders';
import * as s0042 from '../permissions/20260519-0029-PostageOrders';
import * as s0043 from '../permissions/20260519-0030-TotalOrders';
import * as s0044 from '../permissions/20260519-0031-Courier';
import * as s0045 from '../permissions/20260519-0032-CourierPrice';
import * as s0046 from '../permissions/20260519-0033-CourierOrders';
import * as s0047 from '../permissions/20260519-0034-DeliveryOrders';
import * as s0048 from '../permissions/20260519-0035-VariationPrices';
import * as s0049 from '../permissions/20260519-0036-ReportAdminSales';
import * as s0050 from '../permissions/20260519-0037-ReportVendorSales';
import * as s0051 from '../permissions/20260519-0038-ReportAdminCouriers';
import * as s0052 from '../permissions/20260519-0039-ReportAdminPosts';
import * as s0053 from '../permissions/20260519-0040-ReportCouriers';
import * as s0054 from '../permissions/20260519-0041-PaymentGateways';
import * as s0055 from '../permissions/20260519-0042-PaymentTransactions';
import * as s0056 from '../permissions/20260519-0043-InventoriesReport';
import * as s0057 from '../permissions/20260519-0044-InventoryStatus';
import * as s0058 from '../permissions/20260519-0045-EntityTypeFactors';
import * as s0059 from '../permissions/20260519-0046-ProductComments';
import * as s0060 from '../permissions/20260519-0047-ProductCommentStatus';
import * as s0061 from '../permissions/20260519-0048-OrderStatus';
import * as s0062 from '../permissions/20260519-0049-OrderShipmentWays';
import * as s0063 from '../permissions/20260519-0050-AdminAddress';
import * as s0064 from '../permissions/20260519-0051-ReportProductSales';
import * as s0065 from '../permissions/20260519-0052-InventoryHistories';
import * as s0066 from '../permissions/20260519-0053-Pages';
import * as s0067 from '../permissions/20260519-0054-CancellOrders';
import * as s0068 from '../permissions/20260519-0055-HomePages';
import * as s0069 from '../permissions/20260519-0056-HomePagePhotoss';
import * as s0070 from '../permissions/20260519-0057-ProductVideos';
import * as s0071 from '../permissions/20260519-0058-Notification';
import * as s0072 from '../permissions/20260519-0059-HeaderNotification';
import * as s0073 from '../permissions/20260519-0060-GoldCurrentPrices';
import * as s0074 from '../permissions/20260519-0061-PriceFormulas';
import * as s0075 from '../permissions/20260519-0062-FactorDiscounts';
import * as s0076 from '../permissions/20260519-0063-SelectedProducts';
import * as s0077 from '../permissions/20260519-0064-SelectedProductItems';
import * as s0078 from '../permissions/20260519-0065-LinkedEntityTypeBrand';
import * as s0079 from '../permissions/20260519-0066-PublicPhotos';
import * as s0080 from '../permissions/20260519-0067-Logistic';
import * as s0081 from '../permissions/20260519-0068-LogisticUser';
import * as s0082 from '../permissions/20260519-0069-LogisticShipment';
import * as s0083 from '../permissions/20260519-0070-AdminLogisticSendingPeriod';
import * as s0084 from '../permissions/20260519-0071-AdminLogisticWeeklyPeriods';
import * as s0085 from '../permissions/20260519-0072-AdminBuffets';
import * as s0086 from '../permissions/20260519-0073-AdminMenuCategories';
import * as s0087 from '../permissions/20260519-0074-AdminDiscountMenus';
import * as s0088 from '../permissions/20260519-0075-AdminReserves';
import * as s0089 from '../permissions/20260519-0076-CoffeReserves';
import * as s0090 from '../permissions/20260519-0077-AdminReports';
import * as s0091 from '../permissions/20260519-0078-CoffeReports';
import * as s0092 from '../permissions/20260519-0079-QrScan';
import * as s0093 from '../permissions/20260519-0080-Holidays';
import * as s0094 from '../permissions/20260519-0081-FactorReport';
import * as s0095 from '../permissions/20260519-0082-AllFactorReport';
import * as s0096 from '../permissions/20260519-0083-GsBrands';
import * as s0097 from '../permissions/20260519-0084-GsProductTypes';
import * as s0098 from '../permissions/20260519-0085-GsNormalGuarantee';
import * as s0099 from '../permissions/20260519-0086-GsVaraint';
import * as s0100 from '../permissions/20260519-0087-GsGuaranteeOrganizations';
import * as s0101 from '../permissions/20260519-0088-GsGuaranteeOrganizationContracts';
import * as s0102 from '../permissions/20260519-0089-GsGuaranteeAdditionalPackages';
import * as s0103 from '../permissions/20260519-0090-GsGuaranteeCartables';
import * as s0104 from '../permissions/20260519-0091-GsGuaranteeSolutions';
import * as s0105 from '../permissions/20260519-0092-GsGuaranteeTechnicalPersons';
import * as s0106 from '../permissions/20260519-0093-GsGuaranteeVipBundleType';
import * as s0107 from '../permissions/20260519-0094-GsFactors';
import * as s0108 from '../permissions/20260519-0095-GsGuaranteeVipGenerators';
import * as s0109 from '../permissions/20260519-0096-GsGuaranteeTrackingRequests';
import * as s0110 from '../permissions/20260519-0097-GsGuaranteeSuperVisors';
import * as s0111 from '../permissions/20260519-0098-GsGuaranteeResponse';
import * as s0112 from '../permissions/20260519-0099-GsGuaranteeSupplierPersons';
import * as s0113 from '../permissions/20260519-0100-GsGuaranteePreRegistrationOrganizations';
import * as s0114 from '../permissions/20260519-0101-GsGuaranteeIncomeReports';
import * as s0115 from '../permissions/20260519-0102-GsGuaranteeSubscriptions';
import * as s0116 from '../permissions/20260519-0103-GsFaqs';
import * as s0117 from '../permissions/20260519-0104-GsGuaranteeUserActionReports';
import * as s0118 from '../permissions/20260519-0105-GsGuaranteeActivityReports';
import * as s0119 from '../permissions/20260519-0106-GsGuaranteeSupplierReports';
import * as s0120 from '../permissions/20260519-0107-GsGuaranteeTechnicalPersonReports';
import * as s0121 from '../permissions/20260519-0108-GsDiscountCode';
import * as s0122 from '../permissions/20260519-0109-GsRewardRule';
import * as s0123 from '../permissions/20260519-0110-GsGuaranteeDiscountCodeUsages';
import * as s0124 from '../permissions/20260519-0111-GsGuaranteeRewardHistories';
import * as s0125 from '../permissions/20260519-0112-IrangsImportData';

interface Condition {
  key: string;
  values: string[];
}

interface SeedDefinition {
  name: string;
  up: (sequelize: any) => Promise<void>;
  down?: (sequelize: any) => Promise<void>;
  condition?: Condition;
}

const m = (s: any): SeedDefinition => ({ name: s.name, up: s.up, down: s.down });
const cond = (s: any, key: string, ...values: string[]): SeedDefinition => ({
  name: s.name, up: s.up, down: s.down,
  condition: { key, values },
});

export const seeds: SeedDefinition[] = [
  m(s0001),
  m(s0002),
  m(s0003),
  m(s0004),
  m(s0005),
  m(s0006),
  cond(s0007, 'SITE_NAME', 'ecommerce'),
  cond(s0008, 'SITE_NAME', 'ecommerce'),
  cond(s0009, 'SITE_NAME', 'ecommerce'),
  cond(s0010, 'SITE_NAME', 'bpmn'),
  cond(s0011, 'SITE_NAME', 'bpmn'),
  cond(s0012, 'SITE_NAME', 'bpmn'),
  m(s0013),
  m(s0014),
  m(s0015),
  m(s0016),
  m(s0017),
  m(s0018),
  cond(s0019, 'SITE_NAME', 'pcm'),
  cond(s0020, 'SITE_NAME', 'pcm'),
  cond(s0021, 'SITE_NAME', 'pcm'),
  cond(s0022, 'SITE_NAME', 'ecommerce'),
  cond(s0023, 'SITE_NAME', 'ecommerce'),
  cond(s0024, 'SITE_NAME', 'ecommerce'),
  cond(s0025, 'SITE_NAME', 'ecommerce'),
  cond(s0026, 'SITE_NAME', 'ecommerce'),
  cond(s0027, 'SITE_NAME', 'ecommerce'),
  cond(s0028, 'SITE_NAME', 'ecommerce'),
  cond(s0029, 'SITE_NAME', 'ecommerce'),
  cond(s0030, 'SITE_NAME', 'ecommerce'),
  cond(s0031, 'SITE_NAME', 'ecommerce'),
  cond(s0032, 'SITE_NAME', 'ecommerce'),
  cond(s0033, 'SITE_NAME', 'ecommerce'),
  cond(s0034, 'SITE_NAME', 'ecommerce'),
  cond(s0035, 'SITE_NAME', 'ecommerce'),
  cond(s0036, 'SITE_NAME', 'ecommerce'),
  cond(s0037, 'SITE_NAME', 'ecommerce'),
  cond(s0038, 'SITE_NAME', 'ecommerce'),
  cond(s0039, 'SITE_NAME', 'ecommerce'),
  cond(s0040, 'SITE_NAME', 'ecommerce'),
  cond(s0041, 'SITE_NAME', 'ecommerce'),
  cond(s0042, 'SITE_NAME', 'ecommerce'),
  cond(s0043, 'SITE_NAME', 'ecommerce'),
  cond(s0044, 'SITE_NAME', 'ecommerce'),
  cond(s0045, 'SITE_NAME', 'ecommerce'),
  cond(s0046, 'SITE_NAME', 'ecommerce'),
  cond(s0047, 'SITE_NAME', 'ecommerce'),
  cond(s0048, 'SITE_NAME', 'ecommerce'),
  cond(s0049, 'SITE_NAME', 'ecommerce'),
  cond(s0050, 'SITE_NAME', 'ecommerce'),
  cond(s0051, 'SITE_NAME', 'ecommerce'),
  cond(s0052, 'SITE_NAME', 'ecommerce'),
  cond(s0053, 'SITE_NAME', 'ecommerce'),
  cond(s0054, 'SITE_NAME', 'ecommerce'),
  cond(s0055, 'SITE_NAME', 'ecommerce'),
  cond(s0056, 'SITE_NAME', 'ecommerce'),
  cond(s0057, 'SITE_NAME', 'ecommerce'),
  cond(s0058, 'SITE_NAME', 'ecommerce'),
  cond(s0059, 'SITE_NAME', 'ecommerce'),
  cond(s0060, 'SITE_NAME', 'ecommerce'),
  cond(s0061, 'SITE_NAME', 'ecommerce'),
  cond(s0062, 'SITE_NAME', 'ecommerce'),
  cond(s0063, 'SITE_NAME', 'ecommerce'),
  cond(s0064, 'SITE_NAME', 'ecommerce'),
  cond(s0065, 'SITE_NAME', 'ecommerce'),
  cond(s0066, 'SITE_NAME', 'ecommerce'),
  cond(s0067, 'SITE_NAME', 'ecommerce'),
  cond(s0068, 'SITE_NAME', 'ecommerce'),
  cond(s0069, 'SITE_NAME', 'ecommerce'),
  cond(s0070, 'SITE_NAME', 'ecommerce'),
  cond(s0071, 'SITE_NAME', 'ecommerce'),
  cond(s0072, 'SITE_NAME', 'ecommerce'),
  cond(s0073, 'SITE_NAME', 'ecommerce'),
  cond(s0074, 'SITE_NAME', 'ecommerce'),
  cond(s0075, 'SITE_NAME', 'ecommerce'),
  cond(s0076, 'SITE_NAME', 'ecommerce'),
  cond(s0077, 'SITE_NAME', 'ecommerce'),
  cond(s0078, 'SITE_NAME', 'ecommerce'),
  cond(s0079, 'SITE_NAME', 'ecommerce'),
  cond(s0080, 'SITE_NAME', 'ecommerce'),
  cond(s0081, 'SITE_NAME', 'ecommerce'),
  cond(s0082, 'SITE_NAME', 'ecommerce'),
  cond(s0083, 'SITE_NAME', 'ecommerce'),
  cond(s0084, 'SITE_NAME', 'ecommerce'),
  cond(s0085, 'SITE_NAME', 'discountcoffe'),
  cond(s0086, 'SITE_NAME', 'discountcoffe'),
  cond(s0087, 'SITE_NAME', 'discountcoffe'),
  cond(s0088, 'SITE_NAME', 'discountcoffe'),
  cond(s0089, 'SITE_NAME', 'discountcoffe'),
  cond(s0090, 'SITE_NAME', 'discountcoffe'),
  cond(s0091, 'SITE_NAME', 'discountcoffe'),
  cond(s0092, 'SITE_NAME', 'discountcoffe'),
  cond(s0093, 'SITE_NAME', 'discountcoffe'),
  cond(s0094, 'SITE_NAME', 'discountcoffe'),
  cond(s0095, 'SITE_NAME', 'discountcoffe'),
  cond(s0096, 'SITE_NAME', 'guarantee'),
  cond(s0097, 'SITE_NAME', 'guarantee'),
  cond(s0098, 'SITE_NAME', 'guarantee'),
  cond(s0099, 'SITE_NAME', 'guarantee'),
  cond(s0100, 'SITE_NAME', 'guarantee'),
  cond(s0101, 'SITE_NAME', 'guarantee'),
  cond(s0102, 'SITE_NAME', 'guarantee'),
  cond(s0103, 'SITE_NAME', 'guarantee'),
  cond(s0104, 'SITE_NAME', 'guarantee'),
  cond(s0105, 'SITE_NAME', 'guarantee'),
  cond(s0106, 'SITE_NAME', 'guarantee'),
  cond(s0107, 'SITE_NAME', 'guarantee'),
  cond(s0108, 'SITE_NAME', 'guarantee'),
  cond(s0109, 'SITE_NAME', 'guarantee'),
  cond(s0110, 'SITE_NAME', 'guarantee'),
  cond(s0111, 'SITE_NAME', 'guarantee'),
  cond(s0112, 'SITE_NAME', 'guarantee'),
  cond(s0113, 'SITE_NAME', 'guarantee'),
  cond(s0114, 'SITE_NAME', 'guarantee'),
  cond(s0115, 'SITE_NAME', 'guarantee'),
  cond(s0116, 'SITE_NAME', 'guarantee'),
  cond(s0117, 'SITE_NAME', 'guarantee'),
  cond(s0118, 'SITE_NAME', 'guarantee'),
  cond(s0119, 'SITE_NAME', 'guarantee'),
  cond(s0120, 'SITE_NAME', 'guarantee'),
  cond(s0121, 'SITE_NAME', 'guarantee'),
  cond(s0122, 'SITE_NAME', 'guarantee'),
  cond(s0123, 'SITE_NAME', 'guarantee'),
  cond(s0124, 'SITE_NAME', 'guarantee'),
  cond(s0125, 'SITE_NAME', 'guarantee'),
];
