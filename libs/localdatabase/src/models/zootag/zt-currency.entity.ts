import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'ZT_Currencies' })
export class ZTCurrency extends Model<ZTCurrency> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @Column({ type: DataType.STRING(10), allowNull: false, unique: true })
  code: string;

  @AutoMap()
  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @AutoMap()
  @Column({ type: DataType.STRING(20), allowNull: false })
  symbol: string;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 6), allowNull: false, defaultValue: 0 })
  exchangeRateToIRR: number;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isBaseCurrency: boolean;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;
}
