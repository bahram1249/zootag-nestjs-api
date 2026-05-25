import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class DeviceSalePreviewQueryDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'device id' })
  deviceId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'device sale price id' })
  deviceSalePriceId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ required: false, description: 'marketer id (optional)' })
  marketerId?: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'sale date' })
  saleDate: string;
}
