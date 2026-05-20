import { QueryTypes, Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0012-seed-bpmn-actiontypes';

export async function up(sequelize: Sequelize): Promise<void> {
  const { nowVal, ns, top } = createDialectHelpers(sequelize);

  for (const row of [
    { id: 1, name: 'COMMENT' },
    { id: 2, name: 'APPROVE' },
    { id: 3, name: 'REJECT' },
    { id: 4, name: 'CONFIRM' },
  ]) {
    const [existing]: any = await sequelize.query(
      top(1, `SELECT 1 FROM BPMNActionTypes WHERE id = ${row.id}`),
      { raw: true, type: QueryTypes.SELECT },
    );
    if (!existing) {
      await sequelize.query(
        `INSERT INTO BPMNActionTypes (id, name, "createdAt", "updatedAt") VALUES (${row.id}, ${ns(row.name)}, ${nowVal}, ${nowVal})`,
        { raw: true, type: QueryTypes.RAW },
      );
    }
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  await sequelize.query(
    `DELETE FROM BPMNActionTypes WHERE id IN (1, 2, 3, 4)`,
    { raw: true, type: QueryTypes.RAW },
  );
}
