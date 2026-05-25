import { ApiProperty } from '@nestjs/swagger';

class MarketerBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'John Doe' })
  fullName: string;
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

export class MarketerDeviceSalePriceResponseDto {
  @ApiProperty({ example: 1, description: 'ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Marketer ID' })
  marketerId: number;

  @ApiProperty({
    type: () => MarketerBriefDto,
    description: 'Marketer',
    required: false,
  })
  marketer?: MarketerBriefDto;

  @ApiProperty({ example: 1, description: 'Device type ID' })
  deviceTypeId: number;

  @ApiProperty({
    type: () => DeviceTypeBriefDto,
    description: 'Device type',
    required: false,
  })
  deviceType?: DeviceTypeBriefDto;

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
