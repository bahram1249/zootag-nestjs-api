import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export const name = '021-pcm-permissions-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (await checkSetting('key', ['SITE_NAME'], 'pcm')) {
    await createCrudPermissions(sequelize, {
      entityName: 'PeriodTypeGroups',
      groupName: 'pcm.periodtypes',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AgeGroups',
      groupName: 'pcm.ages',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'PublishesGroups',
      groupName: 'pcm.publishes',
      includePermissions: ['getall', 'getone'],
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(_sequelize: Sequelize): Promise<void> {}
