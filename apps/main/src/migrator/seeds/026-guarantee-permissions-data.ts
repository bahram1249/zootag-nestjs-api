import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export const name = '026-guarantee-permissions-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (await checkSetting('key', ['SITE_NAME'], 'guarantee')) {
    await createCrudPermissions(sequelize, {
      entityName: 'IrangsImportData',
      groupName: 'guarantee.admin.irangs-import-data',
      findParentMenu: true,
      parentMenuName: 'اطلاعات پایه گارانتی',
      menuName: 'ورود اطلاعات ایران جی اس',
      menuUrl: '/admin/gs/irangs-import-data',
      includePermissions: ['showmenu', 'getall', 'create'],
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(_sequelize: Sequelize): Promise<void> {}
