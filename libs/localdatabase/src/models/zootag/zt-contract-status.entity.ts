import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'ZT_ContractStatuses' })
export class ZTContractStatus extends Model<ZTContractStatus> {
  @Column({ type: DataType.BIGINT, primaryKey: true })
  id: bigint;

  @AutoMap()
  @Column({ type: DataType.STRING(100), allowNull: false })
  name: string;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;
}
