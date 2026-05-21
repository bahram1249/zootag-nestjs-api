import { ApiProperty } from '@nestjs/swagger';

class ContractPeriodBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Q1 2026' })
  periodName: string;
}

class DeviceTypeBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'GPS Tracker' })
  typeName: string;
  @ApiProperty({ example: 'GT-100' })
  modelCode: string;
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

class UserBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'John' })
  firstname: string;
  @ApiProperty({ example: 'Doe' })
  lastname: string;
}

export class ContractPeriodDevicePriceResponseDto {
  @ApiProperty({ example: 1, description: 'ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Contract period ID' })
  contractPeriodId: number;

  @ApiProperty({ type: () => ContractPeriodBriefDto, description: 'Contract period', required: false })
  contractPeriod?: ContractPeriodBriefDto;

  @ApiProperty({ example: 1, description: 'Device type ID' })
  deviceTypeId: number;

  @ApiProperty({ type: () => DeviceTypeBriefDto, description: 'Device type', required: false })
  deviceType?: DeviceTypeBriefDto;

  @ApiProperty({ example: 1500.50, description: 'Purchase price', required: false })
  purchasePrice?: number;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  currencyId: number;

  @ApiProperty({ type: () => CurrencyBriefDto, description: 'Currency', required: false })
  currency?: CurrencyBriefDto;

  @ApiProperty({ example: 52500000, description: 'Purchase price IRR' })
  purchasePriceIRR: number;

  @ApiProperty({ example: 10, description: 'Minimum quantity' })
  minimumQuantity: number;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ type: () => UserBriefDto, description: 'Created user', required: false })
  createdUser?: UserBriefDto;

  @ApiProperty({ type: () => UserBriefDto, description: 'Updated user', required: false })
  updatedUser?: UserBriefDto;
}
