import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';
import { Type } from 'class-transformer';

export class ContractPeriodDto {
  @AutoMap()
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({ description: 'contract id' })
  contractId: number;

  @AutoMap()
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'period name' })
  periodName: string;

  @AutoMap()
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'start date' })
  startDate: string;

  @AutoMap()
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'end date' })
  endDate: string;

  @AutoMap()
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({ description: 'contract period status id' })
  contractPeriodStatusId: number;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'notes' })
  notes?: string;
}
