import { ApiProperty } from '@nestjs/swagger';

export class DeviceStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Device Status ID (static)' })
  id: number;

  @ApiProperty({ example: 'Active', description: 'Device status title' })
  title: string;

  @ApiProperty({ example: 'active', description: 'Unique slug' })
  slug: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
