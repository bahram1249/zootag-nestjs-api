import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0025-core-create-populatepersiandate-procedure';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dialect, executeRaw } = createDialectHelpers(sequelize);

  if (dialect === 'mssql') {
    await executeRaw(`
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'CORE-PersianDates-v3')
BEGIN
  EXEC('CREATE PROCEDURE PopulatePersianDate @startDate date = N''1879-01-01'', @endDate date = N''1892-01-01'' AS BEGIN SET NOCOUNT ON END')
END`);
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dialect, executeRaw } = createDialectHelpers(sequelize);

  if (dialect === 'mssql') {
    await executeRaw(`
IF OBJECT_ID('dbo.PopulatePersianDate', 'P') IS NOT NULL
DROP PROCEDURE dbo.PopulatePersianDate`);
  }
}
