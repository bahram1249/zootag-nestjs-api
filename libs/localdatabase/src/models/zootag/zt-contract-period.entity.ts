import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTContract } from './zt-contract.entity';
import { ZTContractPeriodStatus } from './zt-contract-period-status.entity';

@Table({ tableName: 'ZT_ContractPeriods' })
export class ZTContractPeriod extends Model {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @ForeignKey(() => ZTContract)
  @Column({ type: DataType.BIGINT, allowNull: false })
  contractId: bigint;

  @AutoMap()
  @Column({ type: DataType.STRING(200), allowNull: false })
  periodName: string;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: false })
  endDate: Date;

  @AutoMap()
  @ForeignKey(() => ZTContractPeriodStatus)
  @Column({ type: DataType.BIGINT, allowNull: false })
  contractPeriodStatusId: bigint;

  @AutoMap()
  @Column({ type: DataType.TEXT, allowNull: true })
  notes: string;

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
