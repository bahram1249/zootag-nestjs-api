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
import { ZTCommissionType } from './zt-commission-type.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'ZT_MarketerCommissions' })
export class ZTMarketerCommission extends Model<ZTMarketerCommission> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @ForeignKey(() => ZTMarketer)
  @Column({ type: DataType.BIGINT, allowNull: false })
  marketerId: bigint;

  @BelongsTo(() => ZTMarketer, { foreignKey: 'marketerId', as: 'marketer' })
  marketer: ZTMarketer;

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
  @Column({ type: DataType.DATEONLY, allowNull: false })
  startDate: Date;

  @AutoMap()
  @Column({ type: DataType.DATEONLY, allowNull: true })
  endDate: Date;

  @AutoMap()
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  priority: number;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

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
