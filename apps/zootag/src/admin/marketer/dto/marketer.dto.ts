import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from 'automapper-classes';

export class MarketerDto {
  @AutoMap()
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'full name' })
  fullName: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ required: false, description: 'mobile' })
  mobile?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiProperty({ required: false, description: 'email' })
  email?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ required: false, description: 'national code' })
  nationalCode?: string;

  @AutoMap()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'default commission type id' })
  defaultCommissionTypeId?: number;

  @AutoMap()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'default commission value' })
  defaultCommissionValue?: number;
}
