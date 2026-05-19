import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '041-bpmn-data';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, checkSetting, top } = createDialectHelpers(sequelize);

  const isBpmn = await checkSetting('key', ['SITE_NAME'], 'bpmn');
  if (!isBpmn) return;

  for (const row of [
    { id: 1, name: 'SQL_CONDITION' },
    { id: 2, name: 'SOURCE_CONDITION' },
  ]) {
    const [ex]: any = await sequelize.query(
      top(1, `SELECT 1 FROM BPMNConditionTypes WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!ex) {
      await sequelize.query(
        `INSERT INTO BPMNConditionTypes (id, name, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }

  for (const row of [
    { id: 1, name: 'SIMPLE_STATE' },
    { id: 2, name: 'EVENT_STATE' },
    { id: 3, name: 'START_STATE' },
    { id: 4, name: 'END_STATE' },
  ]) {
    const [ex]: any = await sequelize.query(
      top(1, `SELECT 1 FROM BPMNActivityTypes WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!ex) {
      await sequelize.query(
        `INSERT INTO BPMNActivityTypes (id, name, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }

  for (const row of [
    { id: 1, name: 'COMMENT' },
    { id: 2, name: 'APPROVE' },
    { id: 3, name: 'REJECT' },
    { id: 4, name: 'CONFIRM' },
  ]) {
    const [ex]: any = await sequelize.query(
      top(1, `SELECT 1 FROM BPMNActionTypes WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!ex) {
      await sequelize.query(
        `INSERT INTO BPMNActionTypes (id, name, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function down(_sequelize: Sequelize): Promise<void> {}
