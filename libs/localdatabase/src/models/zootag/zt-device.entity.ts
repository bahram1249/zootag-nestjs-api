import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTCompany } from './zt-company.entity';
import { ZTDeviceType } from './zt-device-type.entity';
import { ZTContractPeriod } from './zt-contract-period.entity';
import { ZTCurrency } from './zt-currency.entity';
import { ZTDeviceStatus } from './zt-device-status.entity';

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

  @AutoMap()
  @ForeignKey(() => ZTDeviceType)
  @Column({ type: DataType.BIGINT, allowNull: false })
  deviceTypeId: bigint;

  @AutoMap()
  @ForeignKey(() => ZTContractPeriod)
  @Column({ type: DataType.BIGINT, allowNull: false })
  contractPeriodId: bigint;

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
  @Column({ type: DataType.DATE, allowNull: true })
  purchaseDate: Date;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: false })
  warrantyEndDate: Date;

  @AutoMap()
  @ForeignKey(() => ZTDeviceStatus)
  @Column({ type: DataType.BIGINT, allowNull: false })
  deviceStatusId: bigint;

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
