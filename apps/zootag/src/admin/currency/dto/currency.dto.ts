import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';
import { Transform } from 'class-transformer';

export class CurrencyDto {
  @AutoMap()
  @MinLength(2)
  @MaxLength(10)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'currency code' })
  code: string;

  @AutoMap()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'currency name' })
  name: string;

  @AutoMap()
  @MinLength(1)
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'currency symbol' })
  symbol: string;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, description: 'exchange rate to IRR' })
  exchangeRateToIRR?: number;

  @AutoMap()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  @ApiProperty({
    required: false,
    default: false,
    description: 'is base currency',
  })
  isBaseCurrency?: boolean;
}
