import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';

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

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  isDeleted?: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;
}
