import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CurrencyHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'currency id' })
  currencyId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'exchange rate to IRR' })
  exchangeRateToIRR: number;
}
