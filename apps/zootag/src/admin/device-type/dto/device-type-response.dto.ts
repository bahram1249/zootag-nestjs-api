import { ApiProperty } from '@nestjs/swagger';

export class DeviceTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Device Type ID' })
  id: number;

  @ApiProperty({ example: 'GPS Tracker', description: 'Device type name' })
  typeName: string;

  @ApiProperty({ example: 'GT-100', description: 'Model code' })
  modelCode: string;

  @ApiProperty({
    example: 'Standard GPS tracker',
    description: 'Description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
