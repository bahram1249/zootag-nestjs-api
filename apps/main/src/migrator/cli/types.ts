export interface ColumnMeta {
  name: string;
  type: string;
  primaryKey: boolean;
  autoIncrement: boolean;
  allowNull: boolean;
  defaultValue: string | null;
  unique: boolean;
  comment: string | null;
  references?: {
    model: string;
    key: string;
  };
}

export interface IndexMeta {
  name: string;
  columns: string[];
  unique: boolean;
}

export interface ForeignKeyMeta {
  columns: string[];
  refTable: string;
  refColumns: string[];
}

export interface ModelMeta {
  className: string;
  tableName: string;
  columns: Record<string, ColumnMeta>;
  indexes: IndexMeta[];
  foreignKeys: ForeignKeyMeta[];
}

export interface Snapshot {
  version: string;
  generatedAt: string;
  models: Record<string, ModelMeta>;
}

export interface DiffColumn {
  action: 'add' | 'remove' | 'alter';
  tableName: string;
  column: ColumnMeta;
  oldColumn?: ColumnMeta;
}

export interface DiffResult {
  newTables: ModelMeta[];
  removedTables: ModelMeta[];
  diffColumns: DiffColumn[];
}

export interface GeneratorOptions {
  modelsDir: string;
  snapshotDir: string;
  migrationsDir: string;
  dryRun: boolean;
}
