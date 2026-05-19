import { ModelMeta, ColumnMeta, DiffResult, DiffColumn } from './types';

export function diffModels(
  oldModels: Record<string, ModelMeta>,
  newModels: Record<string, ModelMeta>,
): DiffResult {
  const newTables: ModelMeta[] = [];
  const removedTables: ModelMeta[] = [];
  const diffColumns: DiffColumn[] = [];

  for (const [tableName, newModel] of Object.entries(newModels)) {
    const oldModel = oldModels[tableName];
    if (!oldModel) {
      newTables.push(newModel);
      continue;
    }
    const seen = new Set<string>();
    for (const [colName, newCol] of Object.entries(newModel.columns)) {
      seen.add(colName);
      const oldCol = oldModel.columns[colName];
      if (!oldCol) {
        diffColumns.push({
          action: 'add',
          tableName,
          column: newCol,
        });
      } else if (
        normalizeType(oldCol.type) !== normalizeType(newCol.type) ||
        oldCol.primaryKey !== newCol.primaryKey ||
        oldCol.autoIncrement !== newCol.autoIncrement ||
        oldCol.allowNull !== newCol.allowNull
      ) {
        diffColumns.push({
          action: 'alter',
          tableName,
          column: newCol,
          oldColumn: oldCol,
        });
      }
    }
    for (const [colName, oldCol] of Object.entries(oldModel.columns)) {
      if (!seen.has(colName)) {
        diffColumns.push({
          action: 'remove',
          tableName,
          column: oldCol,
        });
      }
    }
  }

  for (const [tableName, oldModel] of Object.entries(oldModels)) {
    if (!newModels[tableName]) {
      removedTables.push(oldModel);
    }
  }

  return { newTables, removedTables, diffColumns };
}

function normalizeType(t: string): string {
  return t.replace(/\s+/g, '').toLowerCase();
}

export function diffHasChanges(diff: DiffResult): boolean {
  return (
    diff.newTables.length > 0 ||
    diff.removedTables.length > 0 ||
    diff.diffColumns.length > 0
  );
}
