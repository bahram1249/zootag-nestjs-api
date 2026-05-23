import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from 'automapper-classes';

export class DeviceSalePriceDto {
  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'device type id' })
  deviceTypeId: number;

  @AutoMap()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'company id' })
  companyId?: number;

  @AutoMap()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'contract period id' })
  contractPeriodId?: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'currency id' })
  currencyId: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'sale price' })
  salePrice: number;

  @AutoMap()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'valid from date' })
  validFrom: string;

  @AutoMap()
  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false, description: 'valid to date' })
  validTo?: string;
}
