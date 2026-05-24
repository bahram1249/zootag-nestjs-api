import { ApiProperty } from '@nestjs/swagger';

class CommissionTypeBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Percent' })
  name: string;
}

export class DeviceSalePreviewResponseDto {
  @ApiProperty({ example: 2500.0, description: 'Sale price' })
  salePrice: number;

  @ApiProperty({ example: 1, description: 'Sale currency ID' })
  saleCurrencyId: number;

  @ApiProperty({ example: 87500000, description: 'Sale price IRR' })
  salePriceIRR: number;

  @ApiProperty({ example: 50000000, description: 'Purchase price IRR' })
  purchasePriceIRR: number;

  @ApiProperty({ example: 37500000, description: 'Gross profit IRR' })
  grossProfitIRR: number;

  @ApiProperty({ example: 1, description: 'Commission type id' })
  commissionTypeId: number;

  @ApiProperty({
    type: () => CommissionTypeBriefDto,
    description: 'Commission type',
    required: false,
  })
  commissionType?: CommissionTypeBriefDto;

  @ApiProperty({ example: 10, description: 'Commission value' })
  commissionValue: number;

  @ApiProperty({ example: 3750000, description: 'Commission amount IRR' })
  commissionAmountIRR: number;

  @ApiProperty({ example: 33750000, description: 'Net profit IRR' })
  netProfitIRR: number;
}
