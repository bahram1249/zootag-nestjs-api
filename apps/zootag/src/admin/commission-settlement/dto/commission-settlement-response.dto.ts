import { ApiProperty } from '@nestjs/swagger';

class MarketerBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'John Doe' })
  fullName: string;
}

class DeviceSaleBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 2500.0 })
  salePrice: number;
  @ApiProperty({ example: 87500000 })
  salePriceIRR: number;
}

class StatusBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Pending' })
  name: string;
}

export class CommissionSettlementResponseDto {
  @ApiProperty({ example: 1, description: 'Commission settlement ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Marketer ID' })
  marketerId: number;

  @ApiProperty({
    type: () => MarketerBriefDto,
    description: 'Marketer',
    required: false,
  })
  marketer?: MarketerBriefDto;

  @ApiProperty({ example: 1, description: 'Device sale ID' })
  deviceSaleId: number;

  @ApiProperty({
    type: () => DeviceSaleBriefDto,
    description: 'Device sale',
    required: false,
  })
  deviceSale?: DeviceSaleBriefDto;

  @ApiProperty({ example: 3750000, description: 'Amount IRR' })
  amountIRR: number;

  @ApiProperty({ example: '2026-06-15', description: 'Payment date' })
  paymentDate: string;

  @ApiProperty({ example: 1, description: 'Status id' })
  statusId: number;

  @ApiProperty({
    type: () => StatusBriefDto,
    description: 'Status',
    required: false,
  })
  status?: StatusBriefDto;

  @ApiProperty({
    example: 'Paid via bank transfer',
    description: 'Notes',
    required: false,
  })
  notes?: string;
}
