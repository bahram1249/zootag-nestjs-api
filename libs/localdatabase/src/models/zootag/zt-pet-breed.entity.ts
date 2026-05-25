import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ZTPetType } from './zt-pet-type.entity';

@Table({ tableName: 'ZT_PetBreeds' })
export class ZTPetBreed extends Model<ZTPetBreed> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: bigint;

  @AutoMap()
  @Column({ type: DataType.STRING(50), allowNull: false })
  name: string;

  @AutoMap()
  @ForeignKey(() => ZTPetType)
  @Column({ type: DataType.BIGINT, allowNull: false })
  petTypeId: bigint;

  @BelongsTo(() => ZTPetType, {
    foreignKey: 'petTypeId',
    as: 'petType',
  })
  petType: ZTPetType;

  @AutoMap()
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;
}
