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
import { ZTPetBreed } from './zt-pet-breed.entity';
import { ZTPetType } from './zt-pet-type.entity';
import { ZTDevice } from './zt-device.entity';

@Table({ tableName: 'ZT_Pets' })
export class ZTPet extends Model<ZTPet> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @Column({ type: DataType.STRING(200), allowNull: false })
  name: string;

  @AutoMap()
  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: false })
  ownerId: bigint;

  @BelongsTo(() => User, { foreignKey: 'ownerId', as: 'owner' })
  owner: User;

  @AutoMap()
  @ForeignKey(() => ZTPetBreed)
  @Column({ type: DataType.BIGINT, allowNull: false })
  breedId: bigint;

  @BelongsTo(() => ZTPetBreed, { foreignKey: 'breedId', as: 'breed' })
  breed: ZTPetBreed;

  @AutoMap()
  @ForeignKey(() => ZTPetType)
  @Column({ type: DataType.BIGINT, allowNull: false })
  petTypeId: bigint;

  @BelongsTo(() => ZTPetType, { foreignKey: 'petTypeId', as: 'petType' })
  petType: ZTPetType;

  @AutoMap()
  @ForeignKey(() => ZTDevice)
  @Column({ type: DataType.BIGINT, allowNull: true })
  deviceId: bigint;

  @BelongsTo(() => ZTDevice, { foreignKey: 'deviceId', as: 'device' })
  device: ZTDevice;

  @AutoMap()
  @Column({ type: DataType.DATEONLY, allowNull: true })
  birthDate: Date;

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
