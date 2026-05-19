import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '005-core-persian-dates';

export async function up(sequelize: Sequelize): Promise<void> {
  const { dialect, colType, createTable, executeRaw } =
    createDialectHelpers(sequelize);

  await createTable(
    'PersianDates',
    [
      'GregorianDate DATE PRIMARY KEY',
      'YearMonthDay ' + colType('VARCHAR(10)') + ' NOT NULL',
      'YearMonth ' + colType('VARCHAR(7)') + ' NOT NULL',
      'WeekDayName ' + colType('NVARCHAR(10)') + ' NOT NULL',
      'WeekDayNumber ' + colType('TINYINT') + ' NOT NULL',
      'DayInMonth ' + colType('TINYINT') + ' NOT NULL',
      'DayInMonthAtLeastTwo ' + colType('VARCHAR(2)') + ' NOT NULL',
      'MonthNumber ' + colType('TINYINT') + ' NOT NULL',
      'MonthNumberAtLeastTwo ' + colType('VARCHAR(2)') + ' NOT NULL',
      'PersianMonthName ' + colType('NVARCHAR(15)') + ' NOT NULL',
      'YearNumber ' + colType('SMALLINT') + ' NOT NULL',
      'DayInYearNumber ' + colType('SMALLINT') + ' NOT NULL',
      'DayNameInMonth ' + colType('NVARCHAR(40)') + ' NOT NULL',
      'DayNameInYear ' + colType('NVARCHAR(50)') + ' NOT NULL',
    ].join(',\n'),
  );

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

    await executeRaw(`
IF NOT EXISTS (SELECT 1 FROM Migrations WHERE version = 'CORE-PersianDates-v3')
BEGIN
  EXEC('CREATE PROCEDURE PopulatePersianDate @startDate date, @endDate date AS BEGIN SET NOCOUNT ON END')
END`);
  }
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('PersianDates');
}
