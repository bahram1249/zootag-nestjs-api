import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BatchItem {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'marketer id' })
  marketerId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'currency id' })
  currencyId: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'sale price' })
  salePrice: number;

  @IsOptional()
  @ApiProperty({ required: false, description: 'is active' })
  isActive?: boolean;
}

export class BatchMarketerDeviceSalePriceDto {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'device sale price id' })
  deviceSalePriceId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchItem)
  @ApiProperty({ type: [BatchItem], description: 'list of marketer prices' })
  items: BatchItem[];
}
