import { ApiProperty } from '@nestjs/swagger';

class CompanyBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'PetTrack Inc.' })
  companyName: string;
}

class CurrencyBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'USD' })
  code: string;
  @ApiProperty({ example: 'US Dollar' })
  name: string;
  @ApiProperty({ example: '$' })
  symbol: string;
}

class ContractStatusBriefDto {
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

export class ContractResponseDto {
  @ApiProperty({ example: 1, description: 'Contract ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Company ID' })
  companyId: number;

  @ApiProperty({ type: () => CompanyBriefDto, description: 'Company', required: false })
  company?: CompanyBriefDto;

  @ApiProperty({ example: 'CN-001', description: 'Contract number' })
  contractNumber: string;

  @ApiProperty({ example: 'Annual Service Contract', description: 'Title' })
  title: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'Start date' })
  startDate: Date;

  @ApiProperty({ example: '2026-12-31T00:00:00.000Z', description: 'End date' })
  endDate: Date;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  currencyId: number;

  @ApiProperty({ type: () => CurrencyBriefDto, description: 'Currency', required: false })
  currency?: CurrencyBriefDto;

  @ApiProperty({ example: 1, description: 'Contract status ID' })
  contractStatusId: number;

  @ApiProperty({ type: () => ContractStatusBriefDto, description: 'Contract status', required: false })
  contractStatus?: ContractStatusBriefDto;

  @ApiProperty({ example: 'Some notes', description: 'Notes', required: false })
  notes?: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ type: () => UserBriefDto, description: 'Created user', required: false })
  createdUser?: UserBriefDto;

  @ApiProperty({ type: () => UserBriefDto, description: 'Updated user', required: false })
  updatedUser?: UserBriefDto;
}
