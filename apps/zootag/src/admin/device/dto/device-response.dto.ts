import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 1, description: 'Device type ID' })
  deviceTypeId: number;

  @ApiProperty({ example: 1, description: 'Contract period ID' })
  contractPeriodId: number;

  @ApiProperty({ example: 1500.00, description: 'Purchase price', required: false })
  purchasePrice?: number;

  @ApiProperty({ example: 1, description: 'Currency ID' })
  currencyId: number;

  @ApiProperty({ example: 50000000, description: 'Purchase price IRR' })
  purchasePriceIRR: number;

  @ApiProperty({ example: '2026-01-15', description: 'Purchase date', required: false })
  purchaseDate?: string;

  @ApiProperty({ example: '2027-01-15', description: 'Warranty end date' })
  warrantyEndDate: string;

  @ApiProperty({ example: 1, description: 'Device status ID' })
  deviceStatusId: number;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
