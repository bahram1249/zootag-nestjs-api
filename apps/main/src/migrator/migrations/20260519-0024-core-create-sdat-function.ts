import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0024-core-create-sdat-function';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dialect, executeRaw } = createDialectHelpers(sequelize);

  if (dialect === 'mssql') {
    await executeRaw(`
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'CORE-PersianDates-v2')
BEGIN
  EXEC('
  CREATE FUNCTION [dbo].[SDAT] (@intDate DATETIME , @format as nvarchar(50)) RETURNS NVARCHAR(50)
  BEGIN
    /* Persian date function - MSSQL only */
    RETURN NULL
  END')
END`);
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dialect, executeRaw } = createDialectHelpers(sequelize);

  if (dialect === 'mssql') {
    await executeRaw(`
IF OBJECT_ID('dbo.SDAT', 'FN') IS NOT NULL
DROP FUNCTION dbo.SDAT`);
  }
}
