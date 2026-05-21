import { ApiProperty } from '@nestjs/swagger';

class CompanyBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'PetTrack Inc.' })
  companyName: string;
}

class DeviceTypeBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'GPS Tracker' })
  typeName: string;
  @ApiProperty({ example: 'GT-100' })
  modelCode: string;
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

class DeviceStatusBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'InStock' })
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

export class DeviceResponseDto {
  @ApiProperty({ example: 1, description: 'Device ID' })
  id: number;

  @ApiProperty({ example: 'SN-001', description: 'Serial number' })
  serialNumber: string;

  @ApiProperty({ example: '123456789012345', description: 'IMEI', required: false })
  imei?: string;

  @ApiProperty({ example: '00:1A:2B:3C:4D:5E', description: 'MAC address', required: false })
  macAddress?: string;

  @ApiProperty({ example: 1, description: 'Company ID' })
  companyId: number;

  @ApiProperty({ type: () => CompanyBriefDto, description: 'Company', required: false })
  company?: CompanyBriefDto;

  @ApiProperty({ example: 1, description: 'Device type ID' })
  deviceTypeId: number;

  @ApiProperty({ type: () => DeviceTypeBriefDto, description: 'Device type', required: false })
  deviceType?: DeviceTypeBriefDto;

  @ApiProperty({ example: 1, description: 'Contract period ID' })
  contractPeriodId: number;

  @ApiProperty({ type: () => ContractPeriodBriefDto, description: 'Contract period', required: false })
  contractPeriod?: ContractPeriodBriefDto;

  @ApiProperty({ example: 1500.00, description: 'Purchase price', required: false })
  purchasePrice?: number;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  currencyId: number;

  @ApiProperty({ type: () => CurrencyBriefDto, description: 'Currency', required: false })
  currency?: CurrencyBriefDto;

  @ApiProperty({ example: 50000000, description: 'Purchase price IRR' })
  purchasePriceIRR: number;

  @ApiProperty({ example: 2500.00, description: 'Selling price', required: false })
  sellingPrice?: number;

  @ApiProperty({ example: 1, description: 'Selling currency ID', required: false })
  sellingCurrencyId?: number;

  @ApiProperty({ type: () => CurrencyBriefDto, description: 'Selling currency', required: false })
  sellingCurrency?: CurrencyBriefDto;

  @ApiProperty({ example: 87500000, description: 'Selling price IRR', required: false })
  sellingPriceIRR?: number;

  @ApiProperty({ example: '2026-01-15', description: 'Purchase date', required: false })
  purchaseDate?: string;

  @ApiProperty({ example: '2027-01-15', description: 'Warranty end date' })
  warrantyEndDate: string;

  @ApiProperty({ example: 1, description: 'Device status ID' })
  deviceStatusId: number;

  @ApiProperty({ type: () => DeviceStatusBriefDto, description: 'Device status', required: false })
  deviceStatus?: DeviceStatusBriefDto;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ type: () => UserBriefDto, description: 'Created user', required: false })
  createdUser?: UserBriefDto;

  @ApiProperty({ type: () => UserBriefDto, description: 'Updated user', required: false })
  updatedUser?: UserBriefDto;
}
