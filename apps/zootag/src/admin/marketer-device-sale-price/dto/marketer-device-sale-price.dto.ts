import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from 'automapper-classes';

export class MarketerDeviceSalePriceDto {
  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'marketer id' })
  marketerId: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'device sale price id' })
  deviceSalePriceId: number;

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
}
