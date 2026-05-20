import { ApiProperty } from '@nestjs/swagger';

export class DeviceTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Device Type ID' })
  id: number;

  @ApiProperty({ example: 'Dog Tracker', description: 'Device type title' })
  title: string;

  @ApiProperty({ example: 'dog-tracker', description: 'Unique slug' })
  slug: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
