import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '010-core-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, checkSetting, top } = createDialectHelpers(sequelize);

  const isDefault = await checkSetting('key', ['SITE_NAME']);
  if (!isDefault) return;

  for (const ut of [
    { id: 1, title: 'حقیقی' },
    { id: 2, title: 'حقوقی' },
  ]) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM UserTypes WHERE id = ${ut.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO UserTypes (id, title, "createdAt", "updatedAt")
         VALUES (${ut.id}, ${ns(ut.title)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }

  const [userRow]: any = await sequelize.query(
    top(1, `SELECT 1 FROM Users WHERE static_id = 1`),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!userRow) {
    await sequelize.query(
      `INSERT INTO Users (firstname, lastname, email, username, "password", phoneNumber, mustChangePassword, lastPasswordChangeDate, static_id, "createdAt", "updatedAt")
       VALUES (${ns('bahram')}, ${ns('rajabi')}, NULL, 'super-admin', '$2b$10$dfyoOL/K4XRHmhR.8qgNXuBUeMY7Hivd4XoUsqg418SkhFXfWib6q', '09213972466', 0, ${nowVal}, 1, ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
  }

  const [roleRow]: any = await sequelize.query(
    top(1, `SELECT 1 FROM Roles WHERE static_id = 1`),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!roleRow) {
    await sequelize.query(
      `INSERT INTO Roles (roleName, static_id, "createdAt", "updatedAt")
       VALUES (${ns('super-admin')}, 1, ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
  }

  const [userRoleRow]: any = await sequelize.query(
    top(
      1,
      `SELECT 1 FROM UserRoles WHERE userId = (SELECT id FROM Users WHERE static_id = 1) AND roleId = (SELECT id FROM Roles WHERE static_id = 1)`,
    ),
    { raw: true, type: QueryTypes.SELECT },
  );
  if (!userRoleRow) {
    await sequelize.query(
      `INSERT INTO UserRoles (userId, roleId, "createdAt", "updatedAt")
       VALUES ((SELECT id FROM Users WHERE static_id = 1), (SELECT id FROM Roles WHERE static_id = 1), ${nowVal}, ${nowVal})`,
      { raw: true, type: QueryTypes.RAW },
    );
  }

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(_sequelize: Sequelize): Promise<void> {}
