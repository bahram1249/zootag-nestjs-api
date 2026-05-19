import * as settingsSeed from './006-settings';
import * as coreData from './010-core-data';
import * as corePermissionsData from './020-core-permissions-data';
import * as pcmPermissionsData from './021-pcm-permissions-data';
import * as eavPermissionsData from './022-eav-permissions-data';
import * as ecommercePermissionsData from './023-ecommerce-permissions-data';
import * as discountcoffePermissionsData from './024-discountcoffe-permissions-data';
import * as gsPermissionsData from './025-gs-permissions-data';
import * as guaranteePermissionsData from './026-guarantee-permissions-data';
import * as eavData from './031-eav-data';
import * as bpmnData from './041-bpmn-data';

interface SeedDefinition {
  name: string;
  up: (sequelize: any) => Promise<void>;
  down?: (sequelize: any) => Promise<void>;
}

export const seeds: SeedDefinition[] = [
  { name: settingsSeed.name, up: settingsSeed.up, down: settingsSeed.down },
  { name: coreData.name, up: coreData.up, down: coreData.down },
  {
    name: corePermissionsData.name,
    up: corePermissionsData.up,
    down: corePermissionsData.down,
  },
  {
    name: pcmPermissionsData.name,
    up: pcmPermissionsData.up,
    down: pcmPermissionsData.down,
  },
  {
    name: eavPermissionsData.name,
    up: eavPermissionsData.up,
    down: eavPermissionsData.down,
  },
  {
    name: ecommercePermissionsData.name,
    up: ecommercePermissionsData.up,
    down: ecommercePermissionsData.down,
  },
  {
    name: discountcoffePermissionsData.name,
    up: discountcoffePermissionsData.up,
    down: discountcoffePermissionsData.down,
  },
  {
    name: gsPermissionsData.name,
    up: gsPermissionsData.up,
    down: gsPermissionsData.down,
  },
  {
    name: guaranteePermissionsData.name,
    up: guaranteePermissionsData.up,
    down: guaranteePermissionsData.down,
  },
  { name: eavData.name, up: eavData.up, down: eavData.down },
  { name: bpmnData.name, up: bpmnData.up, down: bpmnData.down },
];
