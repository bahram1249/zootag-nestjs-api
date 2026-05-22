import { ApiProperty } from '@nestjs/swagger';

export class CurrencyHistoryResponseDto {
  @ApiProperty({ example: 1, description: 'History ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  currencyId: number;

  @ApiProperty({ example: 420000, description: 'Exchange rate to IRR' })
  exchangeRateToIRR: number;

  @ApiProperty({ example: 1, description: 'Created user ID' })
  createdUserId: number;

  @ApiProperty({
    example: '2026-05-22T10:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-05-22T10:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;
}
