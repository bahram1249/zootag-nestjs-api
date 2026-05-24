import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
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

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'marketer id' })
  marketerId: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'sale date' })
  saleDate: string;
}
