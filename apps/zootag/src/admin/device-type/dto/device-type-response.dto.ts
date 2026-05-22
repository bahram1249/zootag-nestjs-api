import { ApiProperty } from '@nestjs/swagger';

class ManufacturerBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Samsung' })
  manufacturerName: string;
}

export class DeviceTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Device Type ID' })
  id: number;

  @ApiProperty({ example: 'GPS Tracker', description: 'Device type name' })
  typeName: string;

  @ApiProperty({ example: 'GT-100', description: 'Model code' })
  modelCode: string;

  @ApiProperty({
    example: 1,
    description: 'Manufacturer ID',
    required: false,
  })
  manufacturerId?: number;

  @ApiProperty({
    type: () => ManufacturerBriefDto,
    description: 'Manufacturer',
    required: false,
  })
  manufacturer?: ManufacturerBriefDto;

  @ApiProperty({
    example: 'Standard GPS tracker',
    description: 'Description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
