import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';
import { Type } from 'class-transformer';

export class ContractPeriodDevicePriceDto {
  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'contract period id' })
  contractPeriodId: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'device type id' })
  deviceTypeId: number;

  @AutoMap()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, description: 'purchase price' })
  purchasePrice?: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'currency id' })
  currencyId: number;

  @AutoMap()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, description: 'purchase price IRR' })
  purchasePriceIRR?: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'minimum quantity' })
  minimumQuantity: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'maximum quantity' })
  maximumQuantity: number;

  @AutoMap()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, description: 'selling price' })
  sellingPrice?: number;

  @AutoMap()
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false, description: 'selling currency id' })
  sellingCurrencyId?: number;

  @AutoMap()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, description: 'selling price IRR' })
  sellingPriceIRR?: number;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'notes' })
  notes?: string;
}
