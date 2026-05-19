import { QueryTypes, Sequelize } from 'sequelize';
import { createCrudPermissions } from '../permission-helper';
import { createDialectHelpers } from '../migration-helper';

export const name = '020-core-permissions-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, checkSetting, top } = createDialectHelpers(sequelize);

  const isDefault = await checkSetting('key', ['SITE_NAME']);
  if (isDefault) {
    await createCrudPermissions(sequelize, {
      entityName: 'AdminUsers',
      groupName: 'core.admin.users',
      parentMenuName: 'مدیریت',
      menuName: 'کاربران',
      menuUrl: '/core/admin/users',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminRoles',
      groupName: 'core.admin.roles',
      findParentMenu: true,
      parentMenuName: 'مدیریت',
      menuName: 'مدیریت نقش ها',
      menuUrl: '/core/admin/roles',
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminPermissions',
      groupName: 'core.admin.permissions',
      findParentMenu: true,
      parentMenuName: 'مدیریت',
      menuName: 'نمایش دسترسی ها',
      menuUrl: '/core/admin/permissions',
      includePermissions: ['showmenu', 'getall', 'getone'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminMenus',
      groupName: 'core.admin.menus',
      findParentMenu: true,
      parentMenuName: 'مدیریت',
      menuName: 'منو ها',
      menuUrl: '/core/admin/menus',
      includePermissions: ['showmenu', 'getall', 'getone', 'create', 'update'],
    });
    await createCrudPermissions(sequelize, {
      entityName: 'AdminPermissionGroups',
      groupName: 'core.admin.permissiongroups',
      findParentMenu: true,
      parentMenuName: 'مدیریت',
      menuName: 'گروه دسترسی',
      menuUrl: '/core/admin/permissionGroups',
      includePermissions: ['showmenu', 'getall', 'getone', 'create', 'update'],
    });
  }

  const isEcommerce = await checkSetting('key', ['SITE_NAME']);
  if (isEcommerce) {
    for (const r of [
      { name: 'فروشنده', sid: 2 },
      { name: 'پیک', sid: 3 },
      { name: 'لاجستیک', sid: 8 },
    ]) {
      const [existing]: any = await sequelize.query(
        top(1, `SELECT 1 FROM Roles WHERE static_id = ${r.sid}`),
        { raw: true, type: QueryTypes.SELECT },
      );
      if (!existing) {
        await sequelize.query(
          `INSERT INTO Roles (roleName, static_id, "createdAt", "updatedAt")
           VALUES (${ns(r.name)}, ${r.sid}, ${nowVal}, ${nowVal})`,
          { raw: true, type: QueryTypes.RAW },
        );
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(_sequelize: Sequelize): Promise<void> {}
