import { Table, Column, Model, DataType, ForeignKey, Unique } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTContractPeriod } from './zt-contract-period.entity';
import { ZTDeviceType } from './zt-device-type.entity';
import { ZTCurrency } from './zt-currency.entity';

@Table({ tableName: 'ZT_ContractPeriodDevicePrices' })
export class ZTContractPeriodDevicePrice extends Model {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @ForeignKey(() => ZTContractPeriod)
  @Column({ type: DataType.BIGINT, allowNull: false })
  contractPeriodId: bigint;

  @AutoMap()
  @ForeignKey(() => ZTDeviceType)
  @Column({ type: DataType.BIGINT, allowNull: false })
  deviceTypeId: bigint;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: true })
  purchasePrice: number;

  @AutoMap()
  @ForeignKey(() => ZTCurrency)
  @Column({ type: DataType.BIGINT, allowNull: false })
  currencyId: bigint;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  purchasePriceIRR: number;

  @AutoMap()
  @Column({ type: DataType.INTEGER, allowNull: false })
  minimumQuantity: number;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  isDeleted: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;
}
