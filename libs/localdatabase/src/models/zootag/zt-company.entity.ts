import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { User } from '@rahino/database';

@Table({ tableName: 'ZT_Companies' })
export class ZTCompany extends Model {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @Column({ type: DataType.STRING(200), allowNull: false })
  companyName: string;

  @AutoMap()
  @Column({ type: DataType.STRING(200), allowNull: false })
  legalName: string;

  @AutoMap()
  @Column({ type: DataType.STRING(100), allowNull: true })
  taxNumber: string;

  @AutoMap()
  @Column({ type: DataType.STRING(200), allowNull: true })
  email: string;

  @AutoMap()
  @Column({ type: DataType.STRING(50), allowNull: true })
  phone: string;

  @AutoMap()
  @Column({ type: DataType.TEXT, allowNull: true })
  address: string;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0 })
  isDeleted?: boolean;

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
