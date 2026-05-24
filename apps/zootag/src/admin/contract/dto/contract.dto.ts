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

export class ContractDto {
  @AutoMap()
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({ description: 'company id' })
  companyId: number;

  @AutoMap()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'contract number' })
  contractNumber: string;

  @AutoMap()
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'title' })
  title: string;

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
  @ApiProperty({ description: 'contract status id' })
  contractStatusId: number;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'notes' })
  notes?: string;
}
