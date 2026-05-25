import { QueryTypes, Sequelize, Transaction } from 'sequelize';
import { createAdapters } from './dialect-adapters';

const DEFAULT_ICONS: Record<string, string> = {
  // Parent menus
  مدیریت: 'settings',
  محصول: 'package',
  وبلاگ: 'file-text',
  فروشنده: 'store',
  'پرداخت و حمل و نقل': 'credit-card',
  پیک: 'truck',
  گزارشات: 'bar-chart',
  'کامنت و بازخورد': 'message-circle',
  'کافه و رستوران': 'coffee',
  'اطلاعات پایه گارانتی': 'shield',
  عملیات: 'clipboard',
  'باشگاه مشتریان': 'users',
  تخفیف: 'tag',
  'اطلاعات پایه': 'database',

  // Child menus — core
  کاربران: 'user',
  'مدیریت نقش ها': 'shield',
  'نمایش دسترسی ها': 'lock',
  'منو ها': 'menu',
  'گروه دسترسی': 'folder',
  صفحات: 'file-text',
  'تنظیمات صفحه اصلی': 'home',
  'اطلاع رسانی': 'bell',
  'اطلاع رسانی بالای سایت': 'bell',
  'تنظیمات قیمت لحظه ای': 'dollar-sign',
  'سوالات متداول': 'help-circle',

  // Child menus — ecommerce / محصول
  'دسته بندی ها': 'folder-tree',
  'برند ها': 'building',
  'رنگ ها': 'palette',
  'گارانتی ها': 'shield-check',
  فروشندگان: 'store',
  محصولات: 'package',
  تخفیفات: 'percent',
  'شرط تخفیف': 'filter',
  'تخفیف ارسال رایگان': 'truck',
  'دستچین کالا ها': 'layers',
  'صفحه ساز دسته بندی و برندها': 'layout',

  // Child menus — فروشنده
  آدرس‌ها: 'map-pin',
  'سفارشات منتظر پردازش': 'clock',
  'سفارشات منتظر ارسال به پست': 'package',
  'همه ی سفارشات': 'shopping-cart',
  'سفارشات منتظر ارسال به پیک': 'truck',
  'سفارشات کنسل شده': 'x-circle',
  'مطالب': 'file-text',
  'انواع محصول': 'cpu',
  'کارت گارانتی های عادی': 'shield-check',
  'مدل دستگاه ها': 'cpu',
  نمایندگان: 'building',
  'شرایط مازاد گارانتی': 'file-plus',
  خدمات: 'wrench',
  'انواع کارت های گارانتی': 'layers',
  'صددور کارت گارانتی وی آی پی': 'award',
  'ورود اطلاعات ایران جی اس': 'upload',

  // Child menus — پرداخت و حمل و نقل
  'تراکنش ها': 'credit-card',
  'نرخ پستی': 'dollar-sign',
  'پیک ها': 'truck',
  'نرخ پیک': 'dollar-sign',
  لاجستیک: 'package',

  // Child menus — گزارشات
  'میزان فروش و درآمد (ادمین)': 'bar-chart',
  'میزان فروش و درآمد (فروشنده)': 'bar-chart',
  'سفارشات پیکی(ادمین)': 'truck',
  'سفارشات پستی(ادمین)': 'package',
  'سفارشات پیکی': 'truck',
  'کمیسیون درگاه': 'credit-card',
  'آمار موجودی ها': 'box',
  'گزارش تعداد فروش کالا': 'shopping-cart',
  'نظر سنجی ها': 'message-square',
  'گزارش درآمدی': 'trending-up',
  'گزارش عملکرد کاربران': 'users',
  'گزارش فعالیت ها': 'activity',
  'گزارش تامین کنندگان': 'truck',
  'گزارش افراد فنی': 'users',
  'گزارش استفاده از کد تخفیف': 'percent',
  'تاریخچه پاداش': 'award',

  // Child menus — کافه و رستوران
  'لیست کافه و رستوران': 'coffee',
  'لیست دسته بندی های منو': 'list',
  'لیست تمامی سفارش ها': 'shopping-cart',
  'گزارش های ادمین': 'bar-chart',
  'گزارش های کافه': 'bar-chart',
  'اسکن بارکد': 'camera',
  'اعلام روز های تعطیل': 'calendar',
  'صورت حساب': 'file-text',

  // Child menus — عملیات
  کارتابل: 'inbox',
  'تکنسین ها': 'wrench',
  'فاکتور ها': 'file-text',
  'پیگیری درخواست': 'search',
  'ناظر ها': 'eye',
  'تامین کنندگان': 'truck',
  'لیست ثبت نام نمایندگان': 'clipboard',

  // Child menus — تخفیف
  'کدهای تخفیف': 'tag',
  'قوانین پاداش': 'award',

  // Child menus — zootag اطلاعات پایه
  ارزها: 'dollar-sign',
  شرکت‌ها: 'building',
  'انواع دستگاه': 'cpu',
  قراردادها: 'file-contract',
  دستگاه‌ها: 'cpu',
  سازنده‌ها: 'building',
  بازاریاب‌ها: 'users',
  'قیمت‌های فروش دستگاه': 'dollar-sign',
  'فروش دستگاه‌ها': 'shopping-cart',
  'تسویه‌های کمیسیون': 'credit-card',
  'انواع پت': 'paw-print',
  'انواع نژاد': 'dna',
};

function resolveIcon(menuName: string, explicitIcon?: string): string {
  if (explicitIcon) return explicitIcon;
  return DEFAULT_ICONS[menuName] || 'circle';
}

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
    parentCssClass?: string;
    parentIcon?: string;
    cssClass?: string;
    icon?: string;
  },
): Promise<void> {
  const rawDialect = sequelize.getDialect();
  const dialect = (
    typeof rawDialect === 'string' ? rawDialect : String(rawDialect)
  )
    .trim()
    .toLowerCase() as 'mssql' | 'postgres' | 'sqlite';
  const a = createAdapters(dialect);
  const nowVal = a.now();
  const esc = (s: string) => s.replace(/'/g, "''");

  const [existingGroup]: any = await sequelize.query(
    a.top(
      1,
      `SELECT id FROM PermissionGroups WHERE permissionGroupName = ${a.ns(esc(opts.groupName))}`,
    ),
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
        VALUES (${a.ns(esc(opts.groupName))}, 1, ${nowVal}, ${nowVal})`,
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
         VALUES (${a.ns(esc(permName))}, ${a.ns(esc(symbol))}, ${groupId}, ${nowVal}, ${nowVal})`,
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
          a.top(
            1,
            `SELECT id FROM Menus WHERE title = ${a.ns(esc(opts.parentMenuName))}`,
          ),
          { raw: true, type: QueryTypes.SELECT, transaction: t },
        );
        if (parentRow) parentMenuId = parentRow.id;
      } else if (opts.parentMenuName) {
        const parentClassName = opts.parentCssClass
          ? a.ns(esc(opts.parentCssClass))
          : 'NULL';
        const resolvedParentIcon = resolveIcon(
          opts.parentMenuName,
          opts.parentIcon,
        );
        const parentIcon = a.ns(esc(resolvedParentIcon));
        parentMenuId = await insertAndGetId(
          sequelize,
          'Menus',
          `INSERT INTO Menus (title, url, className, icon, visibility, "createdAt", "updatedAt")
            VALUES (${a.ns(esc(opts.parentMenuName))}, NULL, ${parentClassName}, ${parentIcon}, NULL, ${nowVal}, ${nowVal})`,
          t,
        );
      }

      if (parentMenuId) {
        const [linkExists]: any = await sequelize.query(
          a.top(
            1,
            `SELECT 1 FROM PermissionMenus WHERE permissionId = ${showMenuPermId} AND menuId = ${parentMenuId}`,
          ),
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

      const childClassName = opts.cssClass ? a.ns(esc(opts.cssClass)) : 'NULL';
      const resolvedChildIcon = resolveIcon(opts.menuName, opts.icon);
      const childIcon = a.ns(esc(resolvedChildIcon));
      const menuId = await insertAndGetId(
        sequelize,
        'Menus',
        `INSERT INTO Menus (title, url, parentMenuId, className, icon, visibility, "createdAt", "updatedAt")
         VALUES (${a.ns(esc(opts.menuName))}, ${a.ns(esc(opts.menuUrl))}, ${parentMenuId || 'NULL'}, ${childClassName}, ${childIcon}, NULL, ${nowVal}, ${nowVal})`,
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
