import { ApiProperty } from '@nestjs/swagger';

export class CurrencyResponseDto {
  @ApiProperty({ example: 1, description: 'Currency ID' })
  id: number;

  @ApiProperty({ example: 'USD', description: 'Currency code' })
  code: string;

  @ApiProperty({ example: 'US Dollar', description: 'Currency name' })
  name: string;

  @ApiProperty({ example: '$', description: 'Currency symbol' })
  symbol: string;

  @ApiProperty({ example: 420000, description: 'Exchange rate to IRR' })
  exchangeRateToIRR: number;

  @ApiProperty({ example: false, description: 'Is base currency' })
  isBaseCurrency: boolean;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
