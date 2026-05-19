export function mapDataType(typeStr: string): string {
  const t = typeStr.replace(/\s/g, '').toLowerCase();

  if (t === 'bigint') return 'BIGINT';
  if (t === 'integer' || t === 'int') return 'INT';
  if (t === 'smallint') return 'SMALLINT';
  if (t === 'tinyint') return 'TINYINT';
  if (t === 'boolean' || t === 'bool') return 'BIT';
  if (t === 'float' || t === 'real') return 'FLOAT';
  if (t === 'double') return 'FLOAT';
  if (t === 'decimal' || t.startsWith('decimal(')) return typeStr.toUpperCase();
  if (
    t === 'string' ||
    t === 'varchar' ||
    t.startsWith('string(') ||
    t.startsWith('varchar(')
  ) {
    const match = typeStr.match(/\((\d+)\)/);
    const len = match ? match[1] : '255';
    return `NVARCHAR(${len})`;
  }
  if (t === 'text' || t === 'ntext') return 'NTEXT';
  if (t === 'date') return 'DATE';
  if (t === 'dateonly') return 'DATE';
  if (t === 'time') return 'TIME';
  if (t === 'datetime' || t === 'timestamp') return 'DATETIME';
  if (t === 'json' || t === 'jsonb') return 'NVARCHAR(MAX)';
  if (t === 'uuid') return 'UNIQUEIDENTIFIER';
  if (t === 'blob') return 'VARBINARY(MAX)';

  return typeStr;
}
