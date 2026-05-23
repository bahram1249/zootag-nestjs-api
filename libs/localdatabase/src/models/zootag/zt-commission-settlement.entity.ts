import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTMarketer } from './zt-marketer.entity';
import { ZTDeviceSale } from './zt-device-sale.entity';
import { ZTCommissionSettlementStatus } from './zt-commission-settlement-status.entity';

@Table({ tableName: 'ZT_CommissionSettlements' })
export class ZTCommissionSettlement extends Model<ZTCommissionSettlement> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @ForeignKey(() => ZTMarketer)
  @Column({ type: DataType.BIGINT, allowNull: false })
  marketerId: bigint;

  @BelongsTo(() => ZTMarketer, { foreignKey: 'marketerId', as: 'marketer' })
  marketer: ZTMarketer;

  @AutoMap()
  @ForeignKey(() => ZTDeviceSale)
  @Column({ type: DataType.BIGINT, allowNull: false })
  deviceSaleId: bigint;

  @BelongsTo(() => ZTDeviceSale, {
    foreignKey: 'deviceSaleId',
    as: 'deviceSale',
  })
  deviceSale: ZTDeviceSale;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false })
  amountIRR: number;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: false })
  paymentDate: Date;

  @AutoMap()
  @ForeignKey(() => ZTCommissionSettlementStatus)
  @Column({ type: DataType.BIGINT, allowNull: false })
  statusId: bigint;

  @BelongsTo(() => ZTCommissionSettlementStatus, {
    foreignKey: 'statusId',
    as: 'status',
  })
  status: ZTCommissionSettlementStatus;

  @AutoMap()
  @Column({ type: DataType.TEXT, allowNull: true })
  notes: string;
}
