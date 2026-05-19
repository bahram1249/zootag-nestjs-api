import { Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export const name = '022-eav-permissions-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { checkSetting } = createDialectHelpers(sequelize);
  if (await checkSetting('key', ['SITE_NAME'], 'ecommerce')) {
    await createCrudPermissions(sequelize, {
      entityName: 'EntityTypes',
      groupName: 'eav.admin.entitytype',
      parentMenuName: 'محصول',
      menuName: 'دسته بندی ها',
      menuUrl: '/admin/eav/entityTypes',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'EntityModels',
      groupName: 'eav.admin.entitymodel',
      includePermissions: ['getall'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AttributeTypes',
      groupName: 'eav.admin.attributetypes',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Attributes',
      groupName: 'eav.admin.attribute',
      includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AttributeValues',
      groupName: 'eav.admin.attributevalue',
      includePermissions: ['getall', 'getone', 'create', 'update', 'delete'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'BlogPublishes',
      groupName: 'eav.admin.blogpublishes',
      includePermissions: ['getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'BlogEntityTypes',
      groupName: 'eav.admin.entitytype',
      parentMenuName: 'وبلاگ',
      menuName: 'دسته بندی ها',
      menuUrl: '/admin/eav/blogEntityTypes',
      includePermissions: ['showmenu'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'Posts',
      groupName: 'eav.admin.posts',
      findParentMenu: true,
      parentMenuName: 'وبلاگ',
      menuName: 'مطالب',
      menuUrl: '/admin/eav/posts',
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(_sequelize: Sequelize): Promise<void> {}
