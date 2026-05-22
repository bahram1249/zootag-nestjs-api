import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTContract } from './zt-contract.entity';
import { ZTContractPeriodStatus } from './zt-contract-period-status.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'ZT_ContractPeriods' })
export class ZTContractPeriod extends Model<ZTContractPeriod> {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @ForeignKey(() => ZTContract)
  @Column({ type: DataType.BIGINT, allowNull: false })
  contractId: bigint;

  @BelongsTo(() => ZTContract, { foreignKey: 'contractId', as: 'contract' })
  contract: ZTContract;

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

  @BelongsTo(() => ZTContractPeriodStatus, {
    foreignKey: 'contractPeriodStatusId',
    as: 'contractPeriodStatus',
  })
  contractPeriodStatus: ZTContractPeriodStatus;

  @AutoMap()
  @Column({ type: DataType.TEXT, allowNull: true })
  notes: string;

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
