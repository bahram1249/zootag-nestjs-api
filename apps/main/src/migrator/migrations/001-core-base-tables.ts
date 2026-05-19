import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '001-core-base-tables';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dialect, idCol, pk, nv, dt, executeRaw, createTable } =
    createDialectHelpers(sequelize);

  await createTable(
    'Settings',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      '[key] ' + nv('250') + ' NOT NULL',
      '[value] ' + nv('MAX') + ' NOT NULL',
      '[type] ' + nv('250') + ' NOT NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );

  await createTable(
    'Migrations',
    [
      'id BIGINT ' + idCol + ' NOT NULL',
      '[version] ' + nv('200') + ' PRIMARY KEY',
      '[description] ' + nv('500') + ' NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );

  await createTable(
    'WinstonLogs',
    [
      'id BIGINT ' + idCol + ' ' + pk,
      '[level] ' + nv('250') + ' NULL',
      'message ' + nv('1024') + ' NULL',
      'meta ' + nv('MAX') + ' NULL',
      '[createdAt] ' + dt(),
      '[updatedAt] ' + dt(),
    ].join(',\n'),
  );

  if (dialect === 'mssql') {
    await executeRaw(`
IF OBJECT_ID('dbo.fnCalcDistanceKM', 'FN') IS NULL
EXEC('CREATE FUNCTION dbo.fnCalcDistanceKM(@lat1 FLOAT = null, @lat2 FLOAT=null, @lon1 FLOAT=null, @lon2 FLOAT=null)  
RETURNS FLOAT   
AS  
BEGIN  
  IF(@lat1 IS NULL OR @lat2 IS NULL OR @lon1 IS NULL OR @lon2 IS NULL) RETURN 0;  
  RETURN ACOS(SIN(PI()*@lat1/180.0)*SIN(PI()*@lat2/180.0)+COS(PI()*@lat1/180.0)*COS(PI()*@lat2/180.0)*COS(PI()*@lon2/180.0-PI()*@lon1/180.0))*6371  
END')`);
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('WinstonLogs', 'Migrations', 'Settings');
}
