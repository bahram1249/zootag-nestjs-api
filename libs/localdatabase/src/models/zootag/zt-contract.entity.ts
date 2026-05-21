import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTCompany } from './zt-company.entity';
import { ZTCurrency } from './zt-currency.entity';
import { ZTContractStatus } from './zt-contract-status.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'ZT_Contracts' })
export class ZTContract extends Model {
  @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
  id: bigint;

  @AutoMap()
  @ForeignKey(() => ZTCompany)
  @Column({ type: DataType.BIGINT, allowNull: false })
  companyId: bigint;

  @BelongsTo(() => ZTCompany, { foreignKey: 'companyId', as: 'company' })
  company: ZTCompany;

  @AutoMap()
  @Column({ type: DataType.STRING(100), allowNull: false })
  contractNumber: string;

  @AutoMap()
  @Column({ type: DataType.STRING(200), allowNull: false })
  title: string;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date;

  @AutoMap()
  @Column({ type: DataType.DATE, allowNull: false })
  endDate: Date;

  @AutoMap()
  @ForeignKey(() => ZTCurrency)
  @Column({ type: DataType.BIGINT, allowNull: false })
  currencyId: bigint;

  @BelongsTo(() => ZTCurrency, { foreignKey: 'currencyId', as: 'currency' })
  currency: ZTCurrency;

  @AutoMap()
  @ForeignKey(() => ZTContractStatus)
  @Column({ type: DataType.BIGINT, allowNull: false })
  contractStatusId: bigint;

  @BelongsTo(() => ZTContractStatus, { foreignKey: 'contractStatusId', as: 'contractStatus' })
  contractStatus: ZTContractStatus;

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
