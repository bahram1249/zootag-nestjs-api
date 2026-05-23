import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTDeviceType } from './zt-device-type.entity';
import { ZTCompany } from './zt-company.entity';
import { ZTContractPeriod } from './zt-contract-period.entity';
import { ZTCurrency } from './zt-currency.entity';

@Table({ tableName: 'ZT_DeviceSalePrices' })
export class ZTDeviceSalePrice extends Model<ZTDeviceSalePrice> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

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
  @ForeignKey(() => ZTCompany)
  @Column({ type: DataType.BIGINT, allowNull: true })
  companyId: bigint;

  @BelongsTo(() => ZTCompany, { foreignKey: 'companyId', as: 'company' })
  company: ZTCompany;

  @AutoMap()
  @ForeignKey(() => ZTContractPeriod)
  @Column({ type: DataType.BIGINT, allowNull: true })
  contractPeriodId: bigint;

  @BelongsTo(() => ZTContractPeriod, {
    foreignKey: 'contractPeriodId',
    as: 'contractPeriod',
  })
  contractPeriod: ZTContractPeriod;

  @AutoMap()
  @ForeignKey(() => ZTCurrency)
  @Column({ type: DataType.BIGINT, allowNull: false })
  currencyId: bigint;

  @BelongsTo(() => ZTCurrency, { foreignKey: 'currencyId', as: 'currency' })
  currency: ZTCurrency;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  salePrice: number;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  salePriceIRR: number;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: false })
  validFrom: Date;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: true })
  validTo: Date;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;
}
