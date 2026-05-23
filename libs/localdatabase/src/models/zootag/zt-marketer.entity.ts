import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTCommissionType } from './zt-commission-type.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'ZT_Marketers' })
export class ZTMarketer extends Model<ZTMarketer> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @Column({ type: DataType.STRING(200), allowNull: false })
  fullName: string;

  @AutoMap()
  @Column({ type: DataType.STRING(20), allowNull: true })
  mobile: string;

  @AutoMap()
  @Column({ type: DataType.STRING(200), allowNull: true })
  email: string;

  @AutoMap()
  @Column({ type: DataType.STRING(20), allowNull: true })
  nationalCode: string;

  @AutoMap()
  @ForeignKey(() => ZTCommissionType)
  @Column({ type: DataType.BIGINT, allowNull: true })
  defaultCommissionTypeId: bigint;

  @BelongsTo(() => ZTCommissionType, {
    foreignKey: 'defaultCommissionTypeId',
    as: 'defaultCommissionType',
  })
  defaultCommissionType: ZTCommissionType;

  @AutoMap()
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: true })
  defaultCommissionValue: number;

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
