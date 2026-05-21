import { ApiProperty } from '@nestjs/swagger';

class ContractBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'CN-001' })
  contractNumber: string;
  @ApiProperty({ example: 'Annual Service Contract' })
  title: string;
}

class ContractPeriodStatusBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Active' })
  name: string;
}

class UserBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'John' })
  firstname: string;
  @ApiProperty({ example: 'Doe' })
  lastname: string;
}

export class ContractPeriodResponseDto {
  @ApiProperty({ example: 1, description: 'Contract period ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Contract ID' })
  contractId: number;

  @ApiProperty({ type: () => ContractBriefDto, description: 'Contract', required: false })
  contract?: ContractBriefDto;

  @ApiProperty({ example: 'Q1 2026', description: 'Period name' })
  periodName: string;

  @ApiProperty({ example: '2026-01-01', description: 'Start date' })
  startDate: Date;

  @ApiProperty({ example: '2026-03-31', description: 'End date' })
  endDate: Date;

  @ApiProperty({ example: 1, description: 'Contract period status ID' })
  contractPeriodStatusId: number;

  @ApiProperty({ type: () => ContractPeriodStatusBriefDto, description: 'Contract period status', required: false })
  contractPeriodStatus?: ContractPeriodStatusBriefDto;

  @ApiProperty({ required: false, example: 'Some notes', description: 'Notes' })
  notes?: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ type: () => UserBriefDto, description: 'Created user', required: false })
  createdUser?: UserBriefDto;

  @ApiProperty({ type: () => UserBriefDto, description: 'Updated user', required: false })
  updatedUser?: UserBriefDto;
}
