import { createDialectHelpers } from '../migration-helper';

import * as m0001 from './20260519-0001-core-create-settings-table';
import * as m0002 from './20260519-0002-core-create-migrations-table';
import * as m0003 from './20260519-0003-core-create-winstonlogs-table';
import * as m0004 from './20260519-0004-core-create-fncalcdistancekm-function';
import * as m0005 from './20260519-0005-core-create-usertypes-table';
import * as m0006 from './20260519-0006-core-create-users-table';
import * as m0007 from './20260519-0007-core-create-index-users-profilephotoid';
import * as m0008 from './20260519-0008-core-alter-users-add-birthdate';
import * as m0009 from './20260519-0009-core-alter-users-add-nationalcode';
import * as m0010 from './20260519-0010-core-alter-users-add-usertypeid';
import * as m0011 from './20260519-0011-core-create-attachmenttypes-table';
import * as m0012 from './20260519-0012-core-create-attachments-table';
import * as m0013 from './20260519-0013-core-alter-attachments-add-bucketname';
import * as m0014 from './20260519-0014-core-alter-attachments-add-etag';
import * as m0015 from './20260519-0015-core-alter-attachments-add-versionid';
import * as m0016 from './20260519-0016-core-create-permissiongroups-table';
import * as m0017 from './20260519-0017-core-create-permissions-table';
import * as m0018 from './20260519-0018-core-create-menus-table';
import * as m0019 from './20260519-0019-core-create-permissionmenus-table';
import * as m0020 from './20260519-0020-core-create-roles-table';
import * as m0021 from './20260519-0021-core-create-rolepermissions-table';
import * as m0022 from './20260519-0022-core-create-userroles-table';
import * as m0023 from './20260519-0023-core-create-persiandates-table';
import * as m0024 from './20260519-0024-core-create-sdat-function';
import * as m0025 from './20260519-0025-core-create-populatepersiandate-procedure';
import * as m0026 from './20260519-0026-settings-insert-sitename-customername';
import * as m0027 from './20260519-0027-eav-create-entitymodels-table';
import * as m0028 from './20260519-0028-eav-create-entitytypes-table';
import * as m0029 from './20260519-0029-eav-alter-entitytypes-add-attachmentid';
import * as m0030 from './20260519-0030-eav-alter-entitytypes-add-metatitle';
import * as m0031 from './20260519-0031-eav-alter-entitytypes-add-metakeywords';
import * as m0032 from './20260519-0032-eav-alter-entitytypes-add-metadescription';
import * as m0033 from './20260519-0033-eav-alter-entitytypes-add-description';
import * as m0034 from './20260519-0034-eav-alter-entitytypes-add-priority';
import * as m0035 from './20260519-0035-eav-alter-entitytypes-add-showlanding';
import * as m0036 from './20260519-0036-eav-create-attributetypes-table';
import * as m0037 from './20260519-0037-eav-alter-attributetypes-add-valuebased';
import * as m0038 from './20260519-0038-eav-create-attributes-table';
import * as m0039 from './20260519-0039-eav-create-attributevalues-table';
import * as m0040 from './20260519-0040-eav-create-entityattributes-table';
import * as m0041 from './20260519-0041-eav-create-entities-table';
import * as m0042 from './20260519-0042-eav-create-entityattributevalues-table';
import * as m0043 from './20260519-0043-eav-create-entityphotos-table';
import * as m0044 from './20260519-0044-eav-create-entityvideos-table';
import * as m0045 from './20260519-0045-eav-create-blogpublishes-table';
import * as m0046 from './20260519-0046-eav-create-posts-table';
import * as m0047 from './20260519-0047-bpmn-create-process-table';
import * as m0048 from './20260519-0048-bpmn-create-conditiontypes-table';
import * as m0049 from './20260519-0049-bpmn-create-conditions-table';
import * as m0050 from './20260519-0050-bpmn-create-actiontypes-table';
import * as m0051 from './20260519-0051-bpmn-create-actions-table';
import * as m0052 from './20260519-0052-bpmn-create-activitytypes-table';
import * as m0053 from './20260519-0053-bpmn-create-activities-table';
import * as m0054 from './20260519-0054-bpmn-create-inboundactions-table';
import * as m0055 from './20260519-0055-bpmn-create-outboundactions-table';
import * as m0056 from './20260519-0056-bpmn-create-referraltypes-table';
import * as m0057 from './20260519-0057-bpmn-create-nodes-table';
import * as m0058 from './20260519-0058-bpmn-alter-nodes-add-name';
import * as m0059 from './20260519-0059-bpmn-alter-nodes-add-description';
import * as m0060 from './20260519-0060-bpmn-alter-nodes-add-eventcall';
import * as m0061 from './20260519-0061-bpmn-create-nodecommandtypes-table';
import * as m0062 from './20260519-0062-bpmn-create-nodecommands-table';
import * as m0063 from './20260519-0063-bpmn-alter-nodecommands-add-route';
import * as m0064 from './20260519-0064-bpmn-create-nodeconditions-table';
import * as m0065 from './20260519-0065-bpmn-create-organizations-table';
import * as m0066 from './20260519-0066-bpmn-create-occurredevents-table';
import * as m0067 from './20260519-0067-bpmn-create-requests-table';
import * as m0068 from './20260519-0068-bpmn-create-requestoccurredevents-table';
import * as m0069 from './20260519-0069-bpmn-create-requeststates-table';
import * as m0070 from './20260519-0070-bpmn-create-requesthistories-table';
import * as m0071 from './20260519-0071-bpmn-create-organizationusers-table';

import * as m0198 from './20260520-0198-create-coresessions';
import * as m0199 from './20260520-0199-alter-coresessions-modify-expiresat';
import * as m0200 from './20260520-0200-alter-coresessions-modify-lastactivityat';

import * as m0201 from './20260520-0201-create-zt_currencies';

import * as m0204 from './20260520-0204-create-zt_companies';

import * as m0206 from './20260520-0206-create-zt_devicetypes';

import * as m0211 from './20260520-0211-create-zt_devicestatuses';
import * as m0212 from './20260520-0212-alter-zt_devicetypes-add-typename';
import * as m0213 from './20260520-0213-alter-zt_devicetypes-add-modelcode';
import * as m0214 from './20260520-0214-alter-zt_devicetypes-add-description';
import * as m0215 from './20260520-0215-alter-zt_devicetypes-drop-title';
import * as m0216 from './20260520-0216-alter-zt_devicetypes-drop-slug';

import * as m0218 from './20260520-0218-create-zt_contractperiodstatuses';
import * as m0220 from './20260520-0220-create-zt_contractstatuses';
import * as m0221 from './20260520-0221-create-zt_contracts';
import * as m0231 from './20260520-0231-create-zt_contractperiods';
import * as m0232 from './20260520-0232-create-zt_contractperioddeviceprices';
import * as m0233 from './20260520-0233-create-zt_devices';

import * as m0234 from './20260521-0234-create-zt_currencyhistories';
import * as m0236 from './20260521-0236-alter-zt_companies-add-createduserid';
import * as m0237 from './20260521-0237-alter-zt_companies-add-updateduserid';
import * as m0238 from './20260521-0238-alter-zt_contractperioddeviceprices-add-createduserid';
import * as m0239 from './20260521-0239-alter-zt_contractperioddeviceprices-add-updateduserid';
import * as m0240 from './20260521-0240-alter-zt_contractperiods-add-createduserid';
import * as m0241 from './20260521-0241-alter-zt_contractperiods-add-updateduserid';
import * as m0242 from './20260521-0242-alter-zt_contracts-add-createduserid';
import * as m0243 from './20260521-0243-alter-zt_contracts-add-updateduserid';
import * as m0244 from './20260521-0244-alter-zt_devices-add-createduserid';
import * as m0245 from './20260521-0245-alter-zt_devices-add-updateduserid';

import * as m0246 from './20260521-0246-alter-zt_companies-modify-isdeleted';
import * as m0247 from './20260521-0247-alter-zt_contractperioddeviceprices-modify-isdeleted';
import * as m0248 from './20260521-0248-alter-zt_contractperiods-modify-isdeleted';
import * as m0249 from './20260521-0249-alter-zt_contracts-modify-isdeleted';
import * as m0250 from './20260521-0250-alter-zt_devicetypes-modify-isdeleted';
import * as m0251 from './20260521-0251-alter-zt_devices-modify-isdeleted';

import * as m0252 from './20260522-0252-alter-zt_contractperioddeviceprices-add-maximumquantity';
import * as m0253 from './20260522-0253-alter-zt_contractperioddeviceprices-add-sellingprice';
import * as m0254 from './20260522-0254-alter-zt_contractperioddeviceprices-add-sellingcurrencyid';
import * as m0255 from './20260522-0255-alter-zt_contractperioddeviceprices-add-sellingpriceirr';
import * as m0256 from './20260522-0256-alter-zt_devices-add-sellingprice';
import * as m0257 from './20260522-0257-alter-zt_devices-add-sellingcurrencyid';
import * as m0258 from './20260522-0258-alter-zt_devices-add-sellingpriceirr';

import * as m0259 from './20260522-0259-alter-zt_contractperioddeviceprices-modify-purchaseprice';
import * as m0260 from './20260522-0260-alter-zt_contractperioddeviceprices-modify-purchasepriceirr';
import * as m0261 from './20260522-0261-alter-zt_currencyhistories-modify-exchangeratetoirr';
import * as m0262 from './20260522-0262-alter-zt_currencies-modify-exchangeratetoirr';
import * as m0263 from './20260522-0263-alter-zt_devices-add-contractperioddevicepriceid';
import * as m0264 from './20260522-0264-alter-zt_devices-modify-purchaseprice';
import * as m0265 from './20260522-0265-alter-zt_devices-modify-purchasepriceirr';

import * as m0267 from './20260522-0267-create-zt_manufacturers';
import * as m0268 from './20260522-0268-alter-zt_devicetypes-add-manufacturerid';

import * as m0270 from './20260523-0270-create-zt_commissionsettlementstatuses';
import * as m0271 from './20260523-0271-create-zt_commissionsettlements';
import * as m0272 from './20260523-0272-create-zt_commissiontypes';
import * as m0273 from './20260523-0273-create-zt_devicesaleprices';
import * as m0274 from './20260523-0274-create-zt_devicesales';
import * as m0275 from './20260523-0275-create-zt_inventorystatuses';
import * as m0276 from './20260523-0276-create-zt_marketers';
import * as m0277 from './20260523-0277-alter-zt_devices-add-inventorystatusid';
import * as m0278 from './20260523-0278-alter-zt_devices-add-saleid';
import * as m0279 from './20260523-0279-alter-zt_devices-drop-sellingprice';
import * as m0280 from './20260523-0280-alter-zt_devices-drop-sellingcurrencyid';
import * as m0281 from './20260523-0281-alter-zt_devices-drop-sellingpriceirr';

import * as m0289 from './20260524-0289-alter-zt_contractperioddeviceprices-drop-sellingprice';
import * as m0290 from './20260524-0290-alter-zt_contractperioddeviceprices-drop-sellingcurrencyid';
import * as m0291 from './20260524-0291-alter-zt_contractperioddeviceprices-drop-sellingpriceirr';

import * as m0292 from './20260524-0292-alter-zt_devicesales-add-devicesalepriceid';

import * as m0293 from './20260524-0293-alter-zt_contracts-drop-currencyid';

import * as m0301 from './20260524-0301-create-zt_marketercommissions';

import * as m0303 from './20260524-0303-create-zt_petbreeds';
import * as m0304 from './20260524-0304-create-zt_pettypes';

import * as m0308 from './20260525-0308-create-zt_marketerdevicesaleprices';
import * as m0309 from './20260525-0309-alter-zt_devicesales-modify-marketerid';
import * as m0310 from './20260525-0310-alter-zt_devicesales-modify-commissiontypeid';

import * as m0312 from './20260525-0312-alter-zt_marketerdevicesaleprices-add-isdeleted';

import * as m0313 from './20260525-0313-alter-zt_marketerdevicesaleprices-drop-validfrom';
import * as m0314 from './20260525-0314-alter-zt_marketerdevicesaleprices-drop-validto';

import * as m0315 from './20260525-0315-alter-zt_marketerdevicesaleprices-add-devicesalepriceid';
import * as m0316 from './20260525-0316-alter-zt_marketerdevicesaleprices-drop-devicetypeid';
interface Condition {
  key: string;
  values: string[];
}

interface MigrationDefinition {
  name: string;
  up: (sequelize: any) => Promise<void>;
  down?: (sequelize: any) => Promise<void>;
  condition?: Condition;
}

const m = (s: any): MigrationDefinition => ({
  name: s.name,
  up: s.up,
  down: s.down,
});
const cond = (
  s: any,
  key: string,
  ...values: string[]
): MigrationDefinition => {
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

export const migrations: MigrationDefinition[] = [
  m(m0001),
  m(m0002),
  m(m0003),
  m(m0004),
  m(m0005),
  m(m0006),
  m(m0007),
  m(m0008),
  m(m0009),
  m(m0010),
  m(m0011),
  m(m0012),
  m(m0013),
  m(m0014),
  m(m0015),
  m(m0016),
  m(m0017),
  m(m0018),
  m(m0019),
  m(m0020),
  m(m0021),
  m(m0022),
  m(m0023),
  m(m0024),
  m(m0025),
  m(m0026),
  cond(m0027, 'SITE_NAME', 'ecommerce'),
  cond(m0028, 'SITE_NAME', 'ecommerce'),
  cond(m0029, 'SITE_NAME', 'ecommerce'),
  cond(m0030, 'SITE_NAME', 'ecommerce'),
  cond(m0031, 'SITE_NAME', 'ecommerce'),
  cond(m0032, 'SITE_NAME', 'ecommerce'),
  cond(m0033, 'SITE_NAME', 'ecommerce'),
  cond(m0034, 'SITE_NAME', 'ecommerce'),
  cond(m0035, 'SITE_NAME', 'ecommerce'),
  cond(m0036, 'SITE_NAME', 'ecommerce'),
  cond(m0037, 'SITE_NAME', 'ecommerce'),
  cond(m0038, 'SITE_NAME', 'ecommerce'),
  cond(m0039, 'SITE_NAME', 'ecommerce'),
  cond(m0040, 'SITE_NAME', 'ecommerce'),
  cond(m0041, 'SITE_NAME', 'ecommerce'),
  cond(m0042, 'SITE_NAME', 'ecommerce'),
  cond(m0043, 'SITE_NAME', 'ecommerce'),
  cond(m0044, 'SITE_NAME', 'ecommerce'),
  cond(m0045, 'SITE_NAME', 'ecommerce'),
  cond(m0046, 'SITE_NAME', 'ecommerce'),
  cond(m0047, 'SITE_NAME', 'bpmn'),
  cond(m0048, 'SITE_NAME', 'bpmn'),
  cond(m0049, 'SITE_NAME', 'bpmn'),
  cond(m0050, 'SITE_NAME', 'bpmn'),
  cond(m0051, 'SITE_NAME', 'bpmn'),
  cond(m0052, 'SITE_NAME', 'bpmn'),
  cond(m0053, 'SITE_NAME', 'bpmn'),
  cond(m0054, 'SITE_NAME', 'bpmn'),
  cond(m0055, 'SITE_NAME', 'bpmn'),
  cond(m0056, 'SITE_NAME', 'bpmn'),
  cond(m0057, 'SITE_NAME', 'bpmn'),
  cond(m0058, 'SITE_NAME', 'bpmn'),
  cond(m0059, 'SITE_NAME', 'bpmn'),
  cond(m0060, 'SITE_NAME', 'bpmn'),
  cond(m0061, 'SITE_NAME', 'bpmn'),
  cond(m0062, 'SITE_NAME', 'bpmn'),
  cond(m0063, 'SITE_NAME', 'bpmn'),
  cond(m0064, 'SITE_NAME', 'bpmn'),
  cond(m0065, 'SITE_NAME', 'bpmn'),
  cond(m0066, 'SITE_NAME', 'bpmn'),
  cond(m0067, 'SITE_NAME', 'bpmn'),
  cond(m0068, 'SITE_NAME', 'bpmn'),
  cond(m0069, 'SITE_NAME', 'bpmn'),
  cond(m0070, 'SITE_NAME', 'bpmn'),
  cond(m0071, 'SITE_NAME', 'bpmn'),

  m(m0198),

  m(m0199),
  m(m0200),

  cond(m0201, 'SITE_NAME', 'Zootag'),

  cond(m0204, 'SITE_NAME', 'Zootag'),

  cond(m0206, 'SITE_NAME', 'Zootag'),

  cond(m0211, 'SITE_NAME', 'Zootag'),
  cond(m0212, 'SITE_NAME', 'Zootag'),
  cond(m0213, 'SITE_NAME', 'Zootag'),
  cond(m0214, 'SITE_NAME', 'Zootag'),
  cond(m0215, 'SITE_NAME', 'Zootag'),
  cond(m0216, 'SITE_NAME', 'Zootag'),

  cond(m0218, 'SITE_NAME', 'Zootag'),
  cond(m0220, 'SITE_NAME', 'Zootag'),
  cond(m0221, 'SITE_NAME', 'Zootag'),
  cond(m0231, 'SITE_NAME', 'Zootag'),
  cond(m0232, 'SITE_NAME', 'Zootag'),
  cond(m0233, 'SITE_NAME', 'Zootag'),

  cond(m0234, 'SITE_NAME', 'Zootag'),
  cond(m0236, 'SITE_NAME', 'Zootag'),
  cond(m0237, 'SITE_NAME', 'Zootag'),
  cond(m0238, 'SITE_NAME', 'Zootag'),
  cond(m0239, 'SITE_NAME', 'Zootag'),
  cond(m0240, 'SITE_NAME', 'Zootag'),
  cond(m0241, 'SITE_NAME', 'Zootag'),
  cond(m0242, 'SITE_NAME', 'Zootag'),
  cond(m0243, 'SITE_NAME', 'Zootag'),
  cond(m0244, 'SITE_NAME', 'Zootag'),
  cond(m0245, 'SITE_NAME', 'Zootag'),

  cond(m0246, 'SITE_NAME', 'Zootag'),
  cond(m0247, 'SITE_NAME', 'Zootag'),
  cond(m0248, 'SITE_NAME', 'Zootag'),
  cond(m0249, 'SITE_NAME', 'Zootag'),
  cond(m0250, 'SITE_NAME', 'Zootag'),
  cond(m0251, 'SITE_NAME', 'Zootag'),

  cond(m0252, 'SITE_NAME', 'Zootag'),
  cond(m0253, 'SITE_NAME', 'Zootag'),
  cond(m0254, 'SITE_NAME', 'Zootag'),
  cond(m0255, 'SITE_NAME', 'Zootag'),
  cond(m0256, 'SITE_NAME', 'Zootag'),
  cond(m0257, 'SITE_NAME', 'Zootag'),
  cond(m0258, 'SITE_NAME', 'Zootag'),

  cond(m0259, 'SITE_NAME', 'Zootag'),
  cond(m0260, 'SITE_NAME', 'Zootag'),
  cond(m0261, 'SITE_NAME', 'Zootag'),
  cond(m0262, 'SITE_NAME', 'Zootag'),
  cond(m0263, 'SITE_NAME', 'Zootag'),
  cond(m0264, 'SITE_NAME', 'Zootag'),
  cond(m0265, 'SITE_NAME', 'Zootag'),
  cond(m0267, 'SITE_NAME', 'Zootag'),

  cond(m0268, 'SITE_NAME', 'Zootag'),

  cond(m0270, 'SITE_NAME', 'Zootag'),
  cond(m0272, 'SITE_NAME', 'Zootag'),

  cond(m0273, 'SITE_NAME', 'Zootag'),

  cond(m0275, 'SITE_NAME', 'Zootag'),
  cond(m0276, 'SITE_NAME', 'Zootag'),

  cond(m0277, 'SITE_NAME', 'Zootag'),

  cond(m0279, 'SITE_NAME', 'Zootag'),

  cond(m0281, 'SITE_NAME', 'Zootag'),

  cond(m0274, 'SITE_NAME', 'Zootag'),

  cond(m0271, 'SITE_NAME', 'Zootag'),

  cond(m0278, 'SITE_NAME', 'Zootag'),
  cond(m0280, 'SITE_NAME', 'Zootag'),

  cond(m0289, 'SITE_NAME', 'Zootag'),
  cond(m0290, 'SITE_NAME', 'Zootag'),
  cond(m0291, 'SITE_NAME', 'Zootag'),

  cond(m0292, 'SITE_NAME', 'Zootag'),

  cond(m0293, 'SITE_NAME', 'Zootag'),

  cond(m0301, 'SITE_NAME', 'Zootag'),

  cond(m0304, 'SITE_NAME', 'Zootag'),
  cond(m0303, 'SITE_NAME', 'Zootag'),

  cond(m0308, 'SITE_NAME', 'Zootag'),
  cond(m0309, 'SITE_NAME', 'Zootag'),
  cond(m0310, 'SITE_NAME', 'Zootag'),

  cond(m0312, 'SITE_NAME', 'Zootag'),
  cond(m0313, 'SITE_NAME', 'Zootag'),

  cond(m0314, 'SITE_NAME', 'Zootag'),
  cond(m0315, 'SITE_NAME', 'Zootag'),

  cond(m0316, 'SITE_NAME', 'Zootag'),
];
