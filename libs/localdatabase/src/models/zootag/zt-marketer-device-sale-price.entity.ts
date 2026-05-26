import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTDeviceSalePrice } from './zt-device-sale-price.entity';
import { ZTMarketer } from './zt-marketer.entity';
import { ZTCurrency } from './zt-currency.entity';

@Table({ tableName: 'ZT_MarketerDeviceSalePrices' })
export class ZTMarketerDeviceSalePrice extends Model<ZTMarketerDeviceSalePrice> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @ForeignKey(() => ZTMarketer)
  @Column({ type: DataType.BIGINT, allowNull: false })
  marketerId: bigint;

  @BelongsTo(() => ZTMarketer, {
    foreignKey: 'marketerId',
    as: 'marketer',
  })
  marketer: ZTMarketer;

  @AutoMap()
  @ForeignKey(() => ZTDeviceSalePrice)
  @Column({ type: DataType.BIGINT, allowNull: false })
  deviceSalePriceId: bigint;

  @BelongsTo(() => ZTDeviceSalePrice, {
    foreignKey: 'deviceSalePriceId',
    as: 'deviceSalePrice',
  })
  deviceSalePrice: ZTDeviceSalePrice;

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
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0 })
  isDeleted: boolean;
}
