import { QueryTypes, Sequelize, Transaction } from 'sequelize';
import { createAdapters } from './dialect-adapters';

async function insertAndGetId(
  sequelize: Sequelize,
  table: string,
  insertSql: string,
  transaction: Transaction,
): Promise<number> {
  const d = sequelize.getDialect() as 'mssql' | 'postgres' | 'sqlite';
  let sql: string;
  if (d === 'mssql') {
    const trimmed = insertSql.replace(/^INSERT\s+INTO\s+\S+\s*/i, '');
    sql = `INSERT INTO ${table} ${trimmed}; SELECT SCOPE_IDENTITY() as id`;
  } else if (d === 'postgres') {
    sql = `${insertSql} RETURNING id`;
  } else {
    sql = insertSql;
    await sequelize.query(sql, {
      raw: true,
      type: QueryTypes.RAW,
      transaction,
    });
    const [row]: any = await sequelize.query(
      `SELECT last_insert_rowid() as id`,
      { raw: true, type: QueryTypes.SELECT, transaction },
    );
    return row?.id;
  }
  const [row]: any = await sequelize.query(sql, {
    raw: true,
    type: QueryTypes.SELECT,
    transaction,
  });
  return row?.id;
}

export async function createCrudPermissions(
  sequelize: Sequelize,
  opts: {
    entityName: string;
    groupName: string;
    findParentMenu?: boolean;
    parentMenuName?: string;
    menuName?: string;
    menuUrl?: string;
    includePermissions?: string[];
    siteName?: string;
  },
): Promise<void> {
  const rawDialect = sequelize.getDialect();
  const dialect = (typeof rawDialect === 'string' ? rawDialect : String(rawDialect)).trim().toLowerCase() as 'mssql' | 'postgres' | 'sqlite';
  const a = createAdapters(dialect);
  const nowVal = a.now();
  const esc = (s: string) => s.replace(/'/g, "''");

  const [existingGroup]: any = await sequelize.query(
    a.top(1, `SELECT id FROM PermissionGroups WHERE permissionGroupName = '${esc(opts.groupName)}'`),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (existingGroup?.id) return;

  const perms = opts.includePermissions || [
    'showmenu',
    'getall',
    'getone',
    'create',
    'update',
    'delete',
  ];

  const [roleRow]: any = await sequelize.query(
    a.top(1, 'SELECT id FROM Roles WHERE static_id = 1'),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!roleRow) throw new Error('Super admin role (static_id=1) not found');
  const roleId = roleRow.id;

  await sequelize.transaction(async (t) => {
    const groupId = await insertAndGetId(
      sequelize,
      'PermissionGroups',
      `INSERT INTO PermissionGroups (permissionGroupName, visibility, "createdAt", "updatedAt")
       VALUES ('${esc(opts.groupName)}', 1, ${nowVal}, ${nowVal})`,
      t,
    );

    let showMenuPermId: number | null = null;
    for (const suffix of perms) {
      const permName = suffix.toUpperCase() + '_' + opts.entityName;
      const symbol = opts.groupName + '.' + suffix;

      const permId = await insertAndGetId(
        sequelize,
        'Permissions',
        `INSERT INTO Permissions (permissionName, permissionSymbol, permissionGroupId, "createdAt", "updatedAt")
         VALUES ('${esc(permName)}', '${esc(symbol)}', ${groupId}, ${nowVal}, ${nowVal})`,
        t,
      );

      await sequelize.query(
        `INSERT INTO RolePermissions (roleId, permissionId, "createdAt", "updatedAt")
         VALUES (${roleId}, ${permId}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW, transaction: t },
      );

      if (suffix === 'showmenu') showMenuPermId = permId;
    }

    if (showMenuPermId && opts.menuName && opts.menuUrl) {
      let parentMenuId: number | null = null;

      if (opts.findParentMenu && opts.parentMenuName) {
        const [parentRow]: any = await sequelize.query(
          a.top(1, `SELECT id FROM Menus WHERE title = '${esc(opts.parentMenuName)}'`),
          { raw: true, type: QueryTypes.SELECT, transaction: t },
        );
        if (parentRow) parentMenuId = parentRow.id;
      } else if (opts.parentMenuName) {
        parentMenuId = await insertAndGetId(
          sequelize,
          'Menus',
          `INSERT INTO Menus (title, url, className, visibility, "createdAt", "updatedAt")
           VALUES ('${esc(opts.parentMenuName)}', NULL, NULL, NULL, ${nowVal}, ${nowVal})`,
          t,
        );
      }

      if (parentMenuId) {
        const [linkExists]: any = await sequelize.query(
          a.top(1, `SELECT 1 FROM PermissionMenus WHERE permissionId = ${showMenuPermId} AND menuId = ${parentMenuId}`),
          { raw: true, type: QueryTypes.SELECT, transaction: t },
        );
        if (!linkExists) {
          await sequelize.query(
            `INSERT INTO PermissionMenus (permissionId, menuId, "createdAt", "updatedAt")
             VALUES (${showMenuPermId}, ${parentMenuId}, ${nowVal}, ${nowVal})`,
            { raw: true, type: QueryTypes.RAW, transaction: t },
          );
        }
      }

      const menuId = await insertAndGetId(
        sequelize,
        'Menus',
        `INSERT INTO Menus (title, url, parentMenuId, className, visibility, "createdAt", "updatedAt")
         VALUES ('${esc(opts.menuName)}', '${esc(opts.menuUrl)}', ${parentMenuId || 'NULL'}, NULL, NULL, ${nowVal}, ${nowVal})`,
        t,
      );

      await sequelize.query(
        `INSERT INTO PermissionMenus (permissionId, menuId, "createdAt", "updatedAt")
         VALUES (${showMenuPermId}, ${menuId}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW, transaction: t },
      );
    }
  });
}
