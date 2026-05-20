import { ApiProperty } from '@nestjs/swagger';

export class ContractPeriodDevicePriceResponseDto {
  @ApiProperty({ example: 1, description: 'ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Contract period ID' })
  contractPeriodId: number;

  @ApiProperty({ example: 1, description: 'Device type ID' })
  deviceTypeId: number;

  @ApiProperty({
    example: 1500.50,
    description: 'Purchase price',
    required: false,
  })
  purchasePrice?: number;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  currencyId: number;

  @ApiProperty({ example: 52500000, description: 'Purchase price IRR' })
  purchasePriceIRR: number;

  @ApiProperty({ example: 10, description: 'Minimum quantity' })
  minimumQuantity: number;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
