import { ApiProperty } from '@nestjs/swagger';

class DeviceTypeBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'GPS Tracker' })
  typeName: string;
  @ApiProperty({ example: 'GT-100' })
  modelCode: string;
}

class CompanyBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'PetTrack Inc.' })
  companyName: string;
}

class ContractPeriodBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Q1 2026' })
  periodName: string;
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

export class DeviceSalePriceResponseDto {
  @ApiProperty({ example: 1, description: 'Device sale price ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Device type ID' })
  deviceTypeId: number;

  @ApiProperty({
    type: () => DeviceTypeBriefDto,
    description: 'Device type',
    required: false,
  })
  deviceType?: DeviceTypeBriefDto;

  @ApiProperty({ example: 1, description: 'Company ID', required: false })
  companyId?: number;

  @ApiProperty({
    type: () => CompanyBriefDto,
    description: 'Company',
    required: false,
  })
  company?: CompanyBriefDto;

  @ApiProperty({
    example: 1,
    description: 'Contract period ID',
    required: false,
  })
  contractPeriodId?: number;

  @ApiProperty({
    type: () => ContractPeriodBriefDto,
    description: 'Contract period',
    required: false,
  })
  contractPeriod?: ContractPeriodBriefDto;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  currencyId: number;

  @ApiProperty({
    type: () => CurrencyBriefDto,
    description: 'Currency',
    required: false,
  })
  currency?: CurrencyBriefDto;

  @ApiProperty({ example: 2500.0, description: 'Sale price' })
  salePrice: number;

  @ApiProperty({ example: 87500000, description: 'Sale price IRR' })
  salePriceIRR: number;

  @ApiProperty({ example: '2026-01-01', description: 'Valid from' })
  validFrom: string;

  @ApiProperty({
    example: '2026-12-31',
    description: 'Valid to',
    required: false,
  })
  validTo?: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
