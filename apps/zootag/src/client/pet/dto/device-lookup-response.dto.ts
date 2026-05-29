import { ApiProperty } from '@nestjs/swagger';

export class DeviceLookupResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'SN-12345' })
  serialNumber: string;

  @ApiProperty({ example: true, description: 'whether the device is available for pet assignment' })
  available: boolean;

  @ApiProperty({ example: 'Device Type Name', required: false })
  deviceTypeName?: string;

  @ApiProperty({ example: 'Model Code', required: false })
  modelCode?: string;
}
