import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '031-eav-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, checkSetting, top } = createDialectHelpers(sequelize);

  const isEcommerce = await checkSetting('key', ['SITE_NAME'], 'ecommerce');
  if (!isEcommerce) return;

  for (const row of [
    { id: 1, name: 'متنی' },
    { id: 2, name: 'عددی' },
    { id: 3, name: 'انتخابی' },
  ]) {
    const [ex]: any = await sequelize.query(
      top(1, `SELECT 1 FROM EAVAttributeTypes WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!ex) {
      await sequelize.query(
        `INSERT INTO EAVAttributeTypes (id, name, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }

  for (const row of [
    { id: 1, name: 'فروشگاه' },
    { id: 2, name: 'وبلاگ' },
  ]) {
    const [ex]: any = await sequelize.query(
      top(1, `SELECT 1 FROM EAVEntityModels WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!ex) {
      await sequelize.query(
        `INSERT INTO EAVEntityModels (id, name, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }

  for (const row of [
    { id: 1, name: 'منتشر شده' },
    { id: 2, name: 'منتشر نشده' },
  ]) {
    const [ex]: any = await sequelize.query(
      top(1, `SELECT 1 FROM EAVBlogPublishes WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!ex) {
      await sequelize.query(
        `INSERT INTO EAVBlogPublishes (id, name, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(_sequelize: Sequelize): Promise<void> {}
