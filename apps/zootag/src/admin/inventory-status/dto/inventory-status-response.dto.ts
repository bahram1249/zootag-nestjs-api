import { ApiProperty } from '@nestjs/swagger';

export class InventoryStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory Status ID' })
  id: number;

  @ApiProperty({ example: 'available', description: 'Inventory status name' })
  name: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
