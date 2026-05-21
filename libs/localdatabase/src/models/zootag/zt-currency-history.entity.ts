import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { ZTCurrency } from './zt-currency.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'ZT_CurrencyHistories' })
export class ZTCurrencyHistory extends Model {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @ForeignKey(() => ZTCurrency)
  @Column({ type: DataType.BIGINT, allowNull: false })
  currencyId: bigint;

  @Column({ type: DataType.DECIMAL(18, 6), allowNull: false })
  exchangeRateToIRR: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  createdUserId: bigint;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  updatedUserId: bigint;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;
}
