import { createDialectHelpers } from '../migration-helper';
import * as s0072 from './20260519-0072-seed-core-settings';
import * as s0073 from './20260519-0073-seed-core-usertypes';
import * as s0074 from './20260519-0074-seed-core-superadmin-user';
import * as s0075 from './20260519-0075-seed-core-superadmin-role';
import * as s0076 from './20260519-0076-seed-core-superadmin-userrole';
import * as s0077 from './20260519-0077-seed-core-attachmenttypes';
import * as s0078 from './20260519-0078-seed-eav-attributetypes';
import * as s0079 from './20260519-0079-seed-eav-entitymodels';
import * as s0080 from './20260519-0080-seed-eav-blogpublishes';
import * as s0081 from './20260519-0081-seed-bpmn-conditiontypes';
import * as s0082 from './20260519-0082-seed-bpmn-activitytypes';
import * as s0083 from './20260519-0083-seed-bpmn-actiontypes';
import * as s0084 from './20260519-0084-seed-core-roles';
import * as s0085 from '../permissions/20260519-0085-AdminUsers';
import * as s0086 from '../permissions/20260519-0086-AdminRoles';
import * as s0087 from '../permissions/20260519-0087-AdminPermissions';
import * as s0088 from '../permissions/20260519-0088-AdminMenus';
import * as s0089 from '../permissions/20260519-0089-AdminPermissionGroups';
import * as s0090 from '../permissions/20260519-0090-PeriodTypeGroups';
import * as s0091 from '../permissions/20260519-0091-AgeGroups';
import * as s0092 from '../permissions/20260519-0092-PublishesGroups';
import * as s0093 from '../permissions/20260519-0093-EntityTypes';
import * as s0094 from '../permissions/20260519-0094-EntityModels';
import * as s0095 from '../permissions/20260519-0095-AttributeTypes';
import * as s0096 from '../permissions/20260519-0096-Attributes';
import * as s0097 from '../permissions/20260519-0097-AttributeValues';
import * as s0098 from '../permissions/20260519-0098-BlogPublishes';
import * as s0099 from '../permissions/20260519-0099-BlogEntityTypes';
import * as s0100 from '../permissions/20260519-0100-Posts';
import * as s0101 from '../permissions/20260519-0101-Brands';
import * as s0102 from '../permissions/20260519-0102-Colors';
import * as s0103 from '../permissions/20260519-0103-Guarantees';
import * as s0104 from '../permissions/20260519-0104-ProductPhotos';
import * as s0105 from '../permissions/20260519-0105-Vendors';
import * as s0106 from '../permissions/20260519-0106-VendorAddresses';
import * as s0107 from '../permissions/20260519-0107-Products';
import * as s0108 from '../permissions/20260519-0108-Discounts';
import * as s0109 from '../permissions/20260519-0109-DiscountConditions';
import * as s0110 from '../permissions/20260519-0110-Transactions';
import * as s0111 from '../permissions/20260519-0111-PostageFees';
import * as s0112 from '../permissions/20260519-0112-PendingOrders';
import * as s0113 from '../permissions/20260519-0113-PostageOrders';
import * as s0114 from '../permissions/20260519-0114-TotalOrders';
import * as s0115 from '../permissions/20260519-0115-Courier';
import * as s0116 from '../permissions/20260519-0116-CourierPrice';
import * as s0117 from '../permissions/20260519-0117-CourierOrders';
import * as s0118 from '../permissions/20260519-0118-DeliveryOrders';
import * as s0119 from '../permissions/20260519-0119-VariationPrices';
import * as s0120 from '../permissions/20260519-0120-ReportAdminSales';
import * as s0121 from '../permissions/20260519-0121-ReportVendorSales';
import * as s0122 from '../permissions/20260519-0122-ReportAdminCouriers';
import * as s0123 from '../permissions/20260519-0123-ReportAdminPosts';
import * as s0124 from '../permissions/20260519-0124-ReportCouriers';
import * as s0125 from '../permissions/20260519-0125-PaymentGateways';
import * as s0126 from '../permissions/20260519-0126-PaymentTransactions';
import * as s0127 from '../permissions/20260519-0127-InventoriesReport';
import * as s0128 from '../permissions/20260519-0128-InventoryStatus';
import * as s0129 from '../permissions/20260519-0129-EntityTypeFactors';
import * as s0130 from '../permissions/20260519-0130-ProductComments';
import * as s0131 from '../permissions/20260519-0131-ProductCommentStatus';
import * as s0132 from '../permissions/20260519-0132-OrderStatus';
import * as s0133 from '../permissions/20260519-0133-OrderShipmentWays';
import * as s0134 from '../permissions/20260519-0134-AdminAddress';
import * as s0135 from '../permissions/20260519-0135-ReportProductSales';
import * as s0136 from '../permissions/20260519-0136-InventoryHistories';
import * as s0137 from '../permissions/20260519-0137-Pages';
import * as s0138 from '../permissions/20260519-0138-CancellOrders';
import * as s0139 from '../permissions/20260519-0139-HomePages';
import * as s0140 from '../permissions/20260519-0140-HomePagePhotoss';
import * as s0141 from '../permissions/20260519-0141-ProductVideos';
import * as s0142 from '../permissions/20260519-0142-Notification';
import * as s0143 from '../permissions/20260519-0143-HeaderNotification';
import * as s0144 from '../permissions/20260519-0144-GoldCurrentPrices';
import * as s0145 from '../permissions/20260519-0145-PriceFormulas';
import * as s0146 from '../permissions/20260519-0146-FactorDiscounts';
import * as s0147 from '../permissions/20260519-0147-SelectedProducts';
import * as s0148 from '../permissions/20260519-0148-SelectedProductItems';
import * as s0149 from '../permissions/20260519-0149-LinkedEntityTypeBrand';
import * as s0150 from '../permissions/20260519-0150-PublicPhotos';
import * as s0151 from '../permissions/20260519-0151-Logistic';
import * as s0152 from '../permissions/20260519-0152-LogisticUser';
import * as s0153 from '../permissions/20260519-0153-LogisticShipment';
import * as s0154 from '../permissions/20260519-0154-AdminLogisticSendingPeriod';
import * as s0155 from '../permissions/20260519-0155-AdminLogisticWeeklyPeriods';
import * as s0156 from '../permissions/20260519-0156-AdminBuffets';
import * as s0157 from '../permissions/20260519-0157-AdminMenuCategories';
import * as s0158 from '../permissions/20260519-0158-AdminDiscountMenus';
import * as s0159 from '../permissions/20260519-0159-AdminReserves';
import * as s0160 from '../permissions/20260519-0160-CoffeReserves';
import * as s0161 from '../permissions/20260519-0161-AdminReports';
import * as s0162 from '../permissions/20260519-0162-CoffeReports';
import * as s0163 from '../permissions/20260519-0163-QrScan';
import * as s0164 from '../permissions/20260519-0164-Holidays';
import * as s0165 from '../permissions/20260519-0165-FactorReport';
import * as s0166 from '../permissions/20260519-0166-AllFactorReport';
import * as s0167 from '../permissions/20260519-0167-GsBrands';
import * as s0168 from '../permissions/20260519-0168-GsProductTypes';
import * as s0169 from '../permissions/20260519-0169-GsNormalGuarantee';
import * as s0170 from '../permissions/20260519-0170-GsVaraint';
import * as s0171 from '../permissions/20260519-0171-GsGuaranteeOrganizations';
import * as s0172 from '../permissions/20260519-0172-GsGuaranteeOrganizationContracts';
import * as s0173 from '../permissions/20260519-0173-GsGuaranteeAdditionalPackages';
import * as s0174 from '../permissions/20260519-0174-GsGuaranteeCartables';
import * as s0175 from '../permissions/20260519-0175-GsGuaranteeSolutions';
import * as s0176 from '../permissions/20260519-0176-GsGuaranteeTechnicalPersons';
import * as s0177 from '../permissions/20260519-0177-GsGuaranteeVipBundleType';
import * as s0178 from '../permissions/20260519-0178-GsFactors';
import * as s0179 from '../permissions/20260519-0179-GsGuaranteeVipGenerators';
import * as s0180 from '../permissions/20260519-0180-GsGuaranteeTrackingRequests';
import * as s0181 from '../permissions/20260519-0181-GsGuaranteeSuperVisors';
import * as s0182 from '../permissions/20260519-0182-GsGuaranteeResponse';
import * as s0183 from '../permissions/20260519-0183-GsGuaranteeSupplierPersons';
import * as s0184 from '../permissions/20260519-0184-GsGuaranteePreRegistrationOrganizations';
import * as s0185 from '../permissions/20260519-0185-GsGuaranteeIncomeReports';
import * as s0186 from '../permissions/20260519-0186-GsGuaranteeSubscriptions';
import * as s0187 from '../permissions/20260519-0187-GsFaqs';
import * as s0188 from '../permissions/20260519-0188-GsGuaranteeUserActionReports';
import * as s0189 from '../permissions/20260519-0189-GsGuaranteeActivityReports';
import * as s0190 from '../permissions/20260519-0190-GsGuaranteeSupplierReports';
import * as s0191 from '../permissions/20260519-0191-GsGuaranteeTechnicalPersonReports';
import * as s0192 from '../permissions/20260519-0192-GsDiscountCode';
import * as s0193 from '../permissions/20260519-0193-GsRewardRule';
import * as s0194 from '../permissions/20260519-0194-GsGuaranteeDiscountCodeUsages';
import * as s0195 from '../permissions/20260519-0195-GsGuaranteeRewardHistories';
import * as s0196 from '../permissions/20260519-0196-IrangsImportData';
import * as s0202 from './20260520-0202-seed-zootag-currencies';
import * as s0203 from '../permissions/20260520-0203-ZootagCurrencies';
import * as s0205 from '../permissions/20260520-0205-ZootagCompanies';

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

const m = (s: any): SeedDefinition => ({
  name: s.name,
  up: s.up,
  down: s.down,
});
const cond = (s: any, key: string, ...values: string[]): SeedDefinition => {
  const wrap = (fn: (sequelize: any) => Promise<void>) => {
    return async (sequelize: any) => {
      const { checkSetting } = createDialectHelpers(sequelize);
      if (await checkSetting('key', [key], ...values)) {
        await fn(sequelize);
      }
    };
  };
  return {
    name: s.name,
    up: s.up ? wrap(s.up) : undefined,
    down: s.down ? wrap(s.down) : undefined,
    condition: { key, values },
  };
};

export const seeds: SeedDefinition[] = [
  m(s0072),
  m(s0073),
  m(s0074),
  m(s0075),
  m(s0076),
  m(s0077),
  cond(s0078, 'SITE_NAME', 'ecommerce'),
  cond(s0079, 'SITE_NAME', 'ecommerce'),
  cond(s0080, 'SITE_NAME', 'ecommerce'),
  cond(s0081, 'SITE_NAME', 'bpmn'),
  cond(s0082, 'SITE_NAME', 'bpmn'),
  cond(s0083, 'SITE_NAME', 'bpmn'),
  m(s0084),
  m(s0085),
  m(s0086),
  m(s0087),
  m(s0088),
  m(s0089),
  cond(s0090, 'SITE_NAME', 'pcm'),
  cond(s0091, 'SITE_NAME', 'pcm'),
  cond(s0092, 'SITE_NAME', 'pcm'),
  cond(s0093, 'SITE_NAME', 'ecommerce'),
  cond(s0094, 'SITE_NAME', 'ecommerce'),
  cond(s0095, 'SITE_NAME', 'ecommerce'),
  cond(s0096, 'SITE_NAME', 'ecommerce'),
  cond(s0097, 'SITE_NAME', 'ecommerce'),
  cond(s0098, 'SITE_NAME', 'ecommerce'),
  cond(s0099, 'SITE_NAME', 'ecommerce'),
  cond(s0100, 'SITE_NAME', 'ecommerce'),
  cond(s0101, 'SITE_NAME', 'ecommerce'),
  cond(s0102, 'SITE_NAME', 'ecommerce'),
  cond(s0103, 'SITE_NAME', 'ecommerce'),
  cond(s0104, 'SITE_NAME', 'ecommerce'),
  cond(s0105, 'SITE_NAME', 'ecommerce'),
  cond(s0106, 'SITE_NAME', 'ecommerce'),
  cond(s0107, 'SITE_NAME', 'ecommerce'),
  cond(s0108, 'SITE_NAME', 'ecommerce'),
  cond(s0109, 'SITE_NAME', 'ecommerce'),
  cond(s0110, 'SITE_NAME', 'ecommerce'),
  cond(s0111, 'SITE_NAME', 'ecommerce'),
  cond(s0112, 'SITE_NAME', 'ecommerce'),
  cond(s0113, 'SITE_NAME', 'ecommerce'),
  cond(s0114, 'SITE_NAME', 'ecommerce'),
  cond(s0115, 'SITE_NAME', 'ecommerce'),
  cond(s0116, 'SITE_NAME', 'ecommerce'),
  cond(s0117, 'SITE_NAME', 'ecommerce'),
  cond(s0118, 'SITE_NAME', 'ecommerce'),
  cond(s0119, 'SITE_NAME', 'ecommerce'),
  cond(s0120, 'SITE_NAME', 'ecommerce'),
  cond(s0121, 'SITE_NAME', 'ecommerce'),
  cond(s0122, 'SITE_NAME', 'ecommerce'),
  cond(s0123, 'SITE_NAME', 'ecommerce'),
  cond(s0124, 'SITE_NAME', 'ecommerce'),
  cond(s0125, 'SITE_NAME', 'ecommerce'),
  cond(s0126, 'SITE_NAME', 'ecommerce'),
  cond(s0127, 'SITE_NAME', 'ecommerce'),
  cond(s0128, 'SITE_NAME', 'ecommerce'),
  cond(s0129, 'SITE_NAME', 'ecommerce'),
  cond(s0130, 'SITE_NAME', 'ecommerce'),
  cond(s0131, 'SITE_NAME', 'ecommerce'),
  cond(s0132, 'SITE_NAME', 'ecommerce'),
  cond(s0133, 'SITE_NAME', 'ecommerce'),
  cond(s0134, 'SITE_NAME', 'ecommerce'),
  cond(s0135, 'SITE_NAME', 'ecommerce'),
  cond(s0136, 'SITE_NAME', 'ecommerce'),
  cond(s0137, 'SITE_NAME', 'ecommerce'),
  cond(s0138, 'SITE_NAME', 'ecommerce'),
  cond(s0139, 'SITE_NAME', 'ecommerce'),
  cond(s0140, 'SITE_NAME', 'ecommerce'),
  cond(s0141, 'SITE_NAME', 'ecommerce'),
  cond(s0142, 'SITE_NAME', 'ecommerce'),
  cond(s0143, 'SITE_NAME', 'ecommerce'),
  cond(s0144, 'SITE_NAME', 'ecommerce'),
  cond(s0145, 'SITE_NAME', 'ecommerce'),
  cond(s0146, 'SITE_NAME', 'ecommerce'),
  cond(s0147, 'SITE_NAME', 'ecommerce'),
  cond(s0148, 'SITE_NAME', 'ecommerce'),
  cond(s0149, 'SITE_NAME', 'ecommerce'),
  cond(s0150, 'SITE_NAME', 'ecommerce'),
  cond(s0151, 'SITE_NAME', 'ecommerce'),
  cond(s0152, 'SITE_NAME', 'ecommerce'),
  cond(s0153, 'SITE_NAME', 'ecommerce'),
  cond(s0154, 'SITE_NAME', 'ecommerce'),
  cond(s0155, 'SITE_NAME', 'ecommerce'),
  cond(s0156, 'SITE_NAME', 'discountcoffe'),
  cond(s0157, 'SITE_NAME', 'discountcoffe'),
  cond(s0158, 'SITE_NAME', 'discountcoffe'),
  cond(s0159, 'SITE_NAME', 'discountcoffe'),
  cond(s0160, 'SITE_NAME', 'discountcoffe'),
  cond(s0161, 'SITE_NAME', 'discountcoffe'),
  cond(s0162, 'SITE_NAME', 'discountcoffe'),
  cond(s0163, 'SITE_NAME', 'discountcoffe'),
  cond(s0164, 'SITE_NAME', 'discountcoffe'),
  cond(s0165, 'SITE_NAME', 'discountcoffe'),
  cond(s0166, 'SITE_NAME', 'discountcoffe'),
  cond(s0167, 'SITE_NAME', 'guarantee'),
  cond(s0168, 'SITE_NAME', 'guarantee'),
  cond(s0169, 'SITE_NAME', 'guarantee'),
  cond(s0170, 'SITE_NAME', 'guarantee'),
  cond(s0171, 'SITE_NAME', 'guarantee'),
  cond(s0172, 'SITE_NAME', 'guarantee'),
  cond(s0173, 'SITE_NAME', 'guarantee'),
  cond(s0174, 'SITE_NAME', 'guarantee'),
  cond(s0175, 'SITE_NAME', 'guarantee'),
  cond(s0176, 'SITE_NAME', 'guarantee'),
  cond(s0177, 'SITE_NAME', 'guarantee'),
  cond(s0178, 'SITE_NAME', 'guarantee'),
  cond(s0179, 'SITE_NAME', 'guarantee'),
  cond(s0180, 'SITE_NAME', 'guarantee'),
  cond(s0181, 'SITE_NAME', 'guarantee'),
  cond(s0182, 'SITE_NAME', 'guarantee'),
  cond(s0183, 'SITE_NAME', 'guarantee'),
  cond(s0184, 'SITE_NAME', 'guarantee'),
  cond(s0185, 'SITE_NAME', 'guarantee'),
  cond(s0186, 'SITE_NAME', 'guarantee'),
  cond(s0187, 'SITE_NAME', 'guarantee'),
  cond(s0188, 'SITE_NAME', 'guarantee'),
  cond(s0189, 'SITE_NAME', 'guarantee'),
  cond(s0190, 'SITE_NAME', 'guarantee'),
  cond(s0191, 'SITE_NAME', 'guarantee'),
  cond(s0192, 'SITE_NAME', 'guarantee'),
  cond(s0193, 'SITE_NAME', 'guarantee'),
  cond(s0194, 'SITE_NAME', 'guarantee'),
  cond(s0195, 'SITE_NAME', 'guarantee'),
  cond(s0196, 'SITE_NAME', 'guarantee'),

  cond(s0202, 'SITE_NAME', 'zootag'),

  cond(s0203, 'SITE_NAME', 'zootag'),

  cond(s0205, 'SITE_NAME', 'zootag'),
];
