import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'ZT_DeviceStatuses' })
export class ZTDeviceStatus extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true })
  id: bigint;

  @AutoMap()
  @Column({ type: DataType.STRING(100), allowNull: false })
  title: string;

  @AutoMap()
  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  slug: string;

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
