import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from 'automapper-classes';

export class DeviceDto {
  @AutoMap()
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'serial number' })
  serialNumber: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ required: false, description: 'imei' })
  imei?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ required: false, description: 'mac address' })
  macAddress?: string;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'company id' })
  companyId: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'device type id' })
  deviceTypeId: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'contract period id' })
  contractPeriodId: number;

  @AutoMap()
  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false, description: 'purchase date' })
  purchaseDate?: string;

  @AutoMap()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'warranty end date' })
  warrantyEndDate: string;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'device status id' })
  deviceStatusId: number;
}
