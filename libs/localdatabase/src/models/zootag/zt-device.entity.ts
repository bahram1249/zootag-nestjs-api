import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTCompany } from './zt-company.entity';
import { ZTDeviceType } from './zt-device-type.entity';
import { ZTContractPeriod } from './zt-contract-period.entity';
import { ZTContractPeriodDevicePrice } from './zt-contract-period-device-price.entity';
import { ZTCurrency } from './zt-currency.entity';
import { ZTDeviceStatus } from './zt-device-status.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'ZT_Devices' })
export class ZTDevice extends Model {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @Column({ type: DataType.STRING(200), allowNull: false })
  serialNumber: string;

  @AutoMap()
  @Column({ type: DataType.STRING(100), allowNull: true })
  imei: string;

  @AutoMap()
  @Column({ type: DataType.STRING(100), allowNull: true })
  macAddress: string;

  @AutoMap()
  @ForeignKey(() => ZTCompany)
  @Column({ type: DataType.BIGINT, allowNull: false })
  companyId: bigint;

  @BelongsTo(() => ZTCompany, { foreignKey: 'companyId', as: 'company' })
  company: ZTCompany;

  @AutoMap()
  @ForeignKey(() => ZTDeviceType)
  @Column({ type: DataType.BIGINT, allowNull: false })
  deviceTypeId: bigint;

  @BelongsTo(() => ZTDeviceType, {
    foreignKey: 'deviceTypeId',
    as: 'deviceType',
  })
  deviceType: ZTDeviceType;

  @AutoMap()
  @ForeignKey(() => ZTContractPeriod)
  @Column({ type: DataType.BIGINT, allowNull: false })
  contractPeriodId: bigint;

  @BelongsTo(() => ZTContractPeriod, {
    foreignKey: 'contractPeriodId',
    as: 'contractPeriod',
  })
  contractPeriod: ZTContractPeriod;

  @AutoMap()
  @ForeignKey(() => ZTContractPeriodDevicePrice)
  @Column({ type: DataType.BIGINT, allowNull: false })
  contractPeriodDevicePriceId: bigint;

  @BelongsTo(() => ZTContractPeriodDevicePrice, {
    foreignKey: 'contractPeriodDevicePriceId',
    as: 'contractPeriodDevicePrice',
  })
  contractPeriodDevicePrice: ZTContractPeriodDevicePrice;

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
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: true })
  sellingPrice: number;

  @AutoMap()
  @ForeignKey(() => ZTCurrency)
  @Column({ type: DataType.BIGINT, allowNull: true })
  sellingCurrencyId: bigint;

  @BelongsTo(() => ZTCurrency, {
    foreignKey: 'sellingCurrencyId',
    as: 'sellingCurrency',
  })
  sellingCurrency: ZTCurrency;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: true })
  sellingPriceIRR: number;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: true })
  purchaseDate: Date;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: false })
  warrantyEndDate: Date;

  @AutoMap()
  @ForeignKey(() => ZTDeviceStatus)
  @Column({ type: DataType.BIGINT, allowNull: false })
  deviceStatusId: bigint;

  @BelongsTo(() => ZTDeviceStatus, {
    foreignKey: 'deviceStatusId',
    as: 'deviceStatus',
  })
  deviceStatus: ZTDeviceStatus;

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
