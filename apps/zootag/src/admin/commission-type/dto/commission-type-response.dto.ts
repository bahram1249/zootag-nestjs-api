import { ApiProperty } from '@nestjs/swagger';

export class CommissionTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Commission Type ID' })
  id: number;

  @ApiProperty({ example: 'percent', description: 'Commission type name' })
  name: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
