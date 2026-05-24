import { ApiProperty } from '@nestjs/swagger';

class DeviceBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'SN-001' })
  serialNumber: string;
  @ApiProperty({ example: '123456789012345', required: false })
  imei?: string;
}

class MarketerBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'John Doe' })
  fullName: string;
}

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

class CommissionTypeBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Percent' })
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

export class DeviceSaleResponseDto {
  @ApiProperty({ example: 1, description: 'Device sale ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Device ID' })
  deviceId: number;

  @ApiProperty({
    type: () => DeviceBriefDto,
    description: 'Device',
    required: false,
  })
  device?: DeviceBriefDto;

  @ApiProperty({ example: 1, description: 'Marketer ID' })
  marketerId: number;

  @ApiProperty({
    type: () => MarketerBriefDto,
    description: 'Marketer',
    required: false,
  })
  marketer?: MarketerBriefDto;

  @ApiProperty({
    example: 1,
    description: 'Customer company ID',
    required: false,
  })
  customerCompanyId?: number;

  @ApiProperty({
    type: () => CompanyBriefDto,
    description: 'Customer company',
    required: false,
  })
  customerCompany?: CompanyBriefDto;

  @ApiProperty({ example: '2026-06-01', description: 'Sale date' })
  saleDate: string;

  @ApiProperty({ example: 2500.0, description: 'Sale price' })
  salePrice: number;

  @ApiProperty({ example: 1, description: 'Sale currency ID' })
  saleCurrencyId: number;

  @ApiProperty({
    type: () => CurrencyBriefDto,
    description: 'Sale currency',
    required: false,
  })
  saleCurrency?: CurrencyBriefDto;

  @ApiProperty({ example: 87500000, description: 'Sale price IRR' })
  salePriceIRR: number;

  @ApiProperty({
    example: 50000000,
    description: 'Purchase price IRR (snapshot)',
  })
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

  @ApiProperty({
    example: 'Sold to customer',
    description: 'Notes',
    required: false,
  })
  notes?: string;

  @ApiProperty({
    example: 1,
    description: 'Device sale price ID',
    required: false,
  })
  deviceSalePriceId?: number;

  @ApiProperty({
    type: () => UserBriefDto,
    description: 'Created user',
    required: false,
  })
  createdUser?: UserBriefDto;
}
