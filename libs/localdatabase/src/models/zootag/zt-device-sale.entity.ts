import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTDevice } from './zt-device.entity';
import { ZTMarketer } from './zt-marketer.entity';
import { ZTCompany } from './zt-company.entity';
import { ZTCurrency } from './zt-currency.entity';
import { ZTCommissionType } from './zt-commission-type.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'ZT_DeviceSales' })
export class ZTDeviceSale extends Model<ZTDeviceSale> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @ForeignKey(() => ZTDevice)
  @Column({ type: DataType.BIGINT, allowNull: false })
  deviceId: bigint;

  @BelongsTo(() => ZTDevice, { foreignKey: 'deviceId', as: 'device' })
  device: ZTDevice;

  @AutoMap()
  @ForeignKey(() => ZTMarketer)
  @Column({ type: DataType.BIGINT, allowNull: false })
  marketerId: bigint;

  @BelongsTo(() => ZTMarketer, { foreignKey: 'marketerId', as: 'marketer' })
  marketer: ZTMarketer;

  @AutoMap()
  @ForeignKey(() => ZTCompany)
  @Column({ type: DataType.BIGINT, allowNull: true })
  customerCompanyId: bigint;

  @BelongsTo(() => ZTCompany, {
    foreignKey: 'customerCompanyId',
    as: 'customerCompany',
  })
  customerCompany: ZTCompany;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: false })
  saleDate: Date;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  salePrice: number;

  @AutoMap()
  @ForeignKey(() => ZTCurrency)
  @Column({ type: DataType.BIGINT, allowNull: false })
  saleCurrencyId: bigint;

  @BelongsTo(() => ZTCurrency, {
    foreignKey: 'saleCurrencyId',
    as: 'saleCurrency',
  })
  saleCurrency: ZTCurrency;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  salePriceIRR: number;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  purchasePriceIRR: number;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  grossProfitIRR: number;

  @AutoMap()
  @ForeignKey(() => ZTCommissionType)
  @Column({ type: DataType.BIGINT, allowNull: false })
  commissionTypeId: bigint;

  @BelongsTo(() => ZTCommissionType, {
    foreignKey: 'commissionTypeId',
    as: 'commissionType',
  })
  commissionType: ZTCommissionType;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  commissionValue: number;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  commissionAmountIRR: number;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  netProfitIRR: number;

  @AutoMap()
  @Column({ type: DataType.TEXT, allowNull: true })
  notes: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  createdUserId: bigint;

  @BelongsTo(() => User, { foreignKey: 'createdUserId', as: 'createdUser' })
  createdUser: User;
}
