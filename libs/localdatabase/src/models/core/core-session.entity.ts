import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { User } from '@rahino/database';

@Table({ tableName: 'CoreSessions' })
export class CoreSession extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: bigint;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ipAddress: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userAgent: string;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt: Date;

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isRevoked: boolean;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastActivityAt: Date;
}
