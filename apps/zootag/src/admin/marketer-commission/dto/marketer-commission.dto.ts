import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from 'automapper-classes';

export class MarketerCommissionDto {
  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'commission type id' })
  commissionTypeId: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'commission value' })
  commissionValue: number;

  @AutoMap()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'start date' })
  startDate: string;

  @AutoMap()
  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false, description: 'end date' })
  endDate?: string;

  @AutoMap()
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @ApiProperty({
    required: false,
    description: 'priority (lower = higher priority)',
  })
  priority?: number;
}
