import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTContractPeriod } from './zt-contract-period.entity';
import { ZTDeviceType } from './zt-device-type.entity';
import { ZTCurrency } from './zt-currency.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'ZT_ContractPeriodDevicePrices' })
export class ZTContractPeriodDevicePrice extends Model {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @ForeignKey(() => ZTContractPeriod)
  @Column({ type: DataType.BIGINT, allowNull: false })
  contractPeriodId: bigint;

  @BelongsTo(() => ZTContractPeriod, { foreignKey: 'contractPeriodId', as: 'contractPeriod' })
  contractPeriod: ZTContractPeriod;

  @AutoMap()
  @ForeignKey(() => ZTDeviceType)
  @Column({ type: DataType.BIGINT, allowNull: false })
  deviceTypeId: bigint;

  @BelongsTo(() => ZTDeviceType, { foreignKey: 'deviceTypeId', as: 'deviceType' })
  deviceType: ZTDeviceType;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: true })
  purchasePrice: number;

  @AutoMap()
  @ForeignKey(() => ZTCurrency)
  @Column({ type: DataType.BIGINT, allowNull: false })
  currencyId: bigint;

  @BelongsTo(() => ZTCurrency, { foreignKey: 'currencyId', as: 'currency' })
  currency: ZTCurrency;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  purchasePriceIRR: number;

  @AutoMap()
  @Column({ type: DataType.INTEGER, allowNull: false })
  minimumQuantity: number;

  @AutoMap()
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  maximumQuantity: number;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: true })
  sellingPrice: number;

  @AutoMap()
  @ForeignKey(() => ZTCurrency)
  @Column({ type: DataType.BIGINT, allowNull: true })
  sellingCurrencyId: bigint;

  @BelongsTo(() => ZTCurrency, { foreignKey: 'sellingCurrencyId', as: 'sellingCurrency' })
  sellingCurrency: ZTCurrency;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: true })
  sellingPriceIRR: number;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0 })
  isDeleted: boolean;

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
