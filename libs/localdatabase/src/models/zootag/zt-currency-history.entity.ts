import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ZTCurrency } from './zt-currency.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'ZT_CurrencyHistories' })
export class ZTCurrencyHistory extends Model {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @ForeignKey(() => ZTCurrency)
  @Column({ type: DataType.BIGINT, allowNull: false })
  currencyId: bigint;

  @BelongsTo(() => ZTCurrency, { foreignKey: 'currencyId', as: 'currency' })
  currency: ZTCurrency;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  createdUserId: bigint;

  @BelongsTo(() => User, { foreignKey: 'createdUserId', as: 'createdUser' })
  createdUser: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  updatedUserId: bigint;

  @BelongsTo(() => User, { foreignKey: 'updatedUserId', as: 'updatedUser' })
  updatedUser: User;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;
}
