import * as coreBaseTables from './001-core-base-tables';
import * as coreUserTables from './002-core-user-tables';
import * as coreAttachmentTables from './003-core-attachment-tables';
import * as corePermissionTables from './004-core-permission-tables';
import * as corePersianDates from './005-core-persian-dates';
import * as coreSettingsData from './006-settings-data';
import * as eav from './030-eav';
import * as bpmn from './040-bpmn';

interface MigrationDefinition {
  name: string;
  up: (sequelize: any) => Promise<void>;
  down?: (sequelize: any) => Promise<void>;
}

export const migrations: MigrationDefinition[] = [
  {
    name: coreBaseTables.name,
    up: coreBaseTables.up,
    down: coreBaseTables.down,
  },
  {
    name: coreUserTables.name,
    up: coreUserTables.up,
    down: coreUserTables.down,
  },
  {
    name: coreAttachmentTables.name,
    up: coreAttachmentTables.up,
    down: coreAttachmentTables.down,
  },
  {
    name: corePermissionTables.name,
    up: corePermissionTables.up,
    down: corePermissionTables.down,
  },
  {
    name: corePersianDates.name,
    up: corePersianDates.up,
    down: corePersianDates.down,
  },
  {
    name: coreSettingsData.name,
    up: coreSettingsData.up,
    down: coreSettingsData.down,
  },
  { name: eav.name, up: eav.up, down: eav.down },
  { name: bpmn.name, up: bpmn.up, down: bpmn.down },
];
