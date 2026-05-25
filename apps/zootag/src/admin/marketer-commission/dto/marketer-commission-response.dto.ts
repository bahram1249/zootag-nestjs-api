import { ApiProperty } from '@nestjs/swagger';

class CommissionTypeBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Percent' })
  name: string;
}

export class MarketerCommissionResponseDto {
  @ApiProperty({ example: 1, description: 'Marketer commission ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Marketer ID' })
  marketerId: number;

  @ApiProperty({ example: 1, description: 'Commission type ID' })
  commissionTypeId: number;

  @ApiProperty({
    type: () => CommissionTypeBriefDto,
    description: 'Commission type',
    required: false,
  })
  commissionType?: CommissionTypeBriefDto;

  @ApiProperty({ example: 10, description: 'Commission value' })
  commissionValue: number;

  @ApiProperty({ example: '2026-01-01', description: 'Start date' })
  startDate: Date;

  @ApiProperty({
    example: '2026-12-31',
    description: 'End date',
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    example: 0,
    description: 'Priority (lower = higher priority)',
  })
  priority: number;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
