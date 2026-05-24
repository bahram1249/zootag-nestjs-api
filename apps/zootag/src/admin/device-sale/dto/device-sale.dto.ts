import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from 'automapper-classes';

export class DeviceSaleDto {
  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'device id' })
  deviceId: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'marketer id' })
  marketerId: number;

  @AutoMap()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'customer company id' })
  customerCompanyId?: number;

  @AutoMap()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'sale date' })
  saleDate: string;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'sale price' })
  salePrice: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'sale currency id' })
  saleCurrencyId: number;

  @AutoMap()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    description: 'commission type id, defaults to marketer default',
  })
  commissionTypeId?: number;

  @AutoMap()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    description: 'commission value, defaults to marketer default',
  })
  commissionValue?: number;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'notes' })
  notes?: string;

  @AutoMap()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'device sale price id' })
  deviceSalePriceId?: number;
}
