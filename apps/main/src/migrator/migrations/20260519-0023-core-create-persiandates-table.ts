import { Sequelize } from 'sequelize';
import { createDialectHelpers } from '../migration-helper';

export const name = '20260519-0023-core-create-persiandates-table';

export async function up(sequelize: Sequelize): Promise<void> {
  const { colType, createTable } = createDialectHelpers(sequelize);

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
}

export async function down(sequelize: Sequelize): Promise<void> {
  const { dropTables } = createDialectHelpers(sequelize);
  await dropTables('PersianDates');
}
