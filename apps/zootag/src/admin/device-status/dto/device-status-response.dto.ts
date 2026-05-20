import { ApiProperty } from '@nestjs/swagger';

export class DeviceStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Device Status ID' })
  id: number;

  @ApiProperty({ example: 'InStock', description: 'Device status name' })
  name: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
