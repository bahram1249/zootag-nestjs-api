import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0006-seed-core-attachmenttypes';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top, checkSetting } = createDialectHelpers(sequelize);

  const hasSiteName = await checkSetting('key', ['SITE_NAME']);
  if (!hasSiteName) return;

  for (const at of [
    { id: 1, name: 'profile' },
    { id: 2, name: 'takhfifBuffetCover' },
    { id: 3, name: 'takhfifMenuCategoryCover' },
    { id: 4, name: 'takhfifMenuCover' },
    { id: 5, name: 'takhfifQrCode' },
    { id: 6, name: 'brands' },
    { id: 7, name: 'guarantees' },
    { id: 8, name: 'entityTypes' },
    { id: 9, name: 'productTempPhoto' },
    { id: 10, name: 'product-photo' },
    { id: 11, name: 'vendors' },
    { id: 12, name: 'coffe-galleries' },
    { id: 13, name: 'bannder-slider' },
    { id: 14, name: 'productTempVideo' },
    { id: 15, name: 'product-video' },
    { id: 16, name: 'selectedproducts' },
    { id: 17, name: 'tempblogphoto' },
    { id: 18, name: 'blogphoto' },
    { id: 19, name: 'tempguaranteerequests' },
    { id: 20, name: 'guaranteerequests' },
    { id: 21, name: 'organizationbussinesslicense' },
    { id: 22, name: 'temporganization' },
    { id: 23, name: 'national' },
    { id: 24, name: 'estate' },
    { id: 25, name: 'postal' },
    { id: 26, name: 'ecommercepublicphoto' },
  ]) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM AttachmentTypes WHERE id = ${at.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO AttachmentTypes (id, typeName, "createdAt", "updatedAt")
         VALUES (${at.id}, ${ns(at.name)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(
    `DELETE FROM AttachmentTypes WHERE id BETWEEN 1 AND 26`,
    { raw: true, type: QueryTypes.RAW },
  );
}
