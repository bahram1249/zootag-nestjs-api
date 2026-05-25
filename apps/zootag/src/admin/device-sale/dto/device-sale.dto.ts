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
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ required: false, description: 'marketer id (optional)' })
  marketerId?: number;

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
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'notes' })
  notes?: string;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'device sale price id' })
  deviceSalePriceId: number;
}
