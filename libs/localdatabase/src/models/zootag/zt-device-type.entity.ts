import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'ZT_DeviceTypes' })
export class ZTDeviceType extends Model<ZTDeviceType> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @Column({ type: DataType.STRING(200), allowNull: false })
  typeName: string;

  @AutoMap()
  @Column({ type: DataType.STRING(100), allowNull: false })
  modelCode: string;

  @AutoMap()
  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: 0 })
  isDeleted: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;
}
