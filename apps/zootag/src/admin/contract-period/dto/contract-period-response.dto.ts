import { ApiProperty } from '@nestjs/swagger';

export class ContractPeriodResponseDto {
  @ApiProperty({ example: 1, description: 'Contract period ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Contract ID' })
  contractId: number;

  @ApiProperty({ example: 'Q1 2026', description: 'Period name' })
  periodName: string;

  @ApiProperty({ example: '2026-01-01', description: 'Start date' })
  startDate: Date;

  @ApiProperty({ example: '2026-03-31', description: 'End date' })
  endDate: Date;

  @ApiProperty({ example: 1, description: 'Contract period status ID' })
  contractPeriodStatusId: number;

  @ApiProperty({ required: false, example: 'Some notes', description: 'Notes' })
  notes?: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
