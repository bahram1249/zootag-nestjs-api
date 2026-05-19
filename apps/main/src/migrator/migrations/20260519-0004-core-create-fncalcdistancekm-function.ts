import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0004-core-create-fncalcdistancekm-function';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dialect, executeRaw } = createDialectHelpers(sequelize);

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
  const { dialect, executeRaw } = createDialectHelpers(sequelize);

  if (dialect === 'mssql') {
    await executeRaw(`
IF OBJECT_ID('dbo.fnCalcDistanceKM', 'FN') IS NOT NULL
DROP FUNCTION dbo.fnCalcDistanceKM`);
  }
}
