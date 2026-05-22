import { ApiProperty } from '@nestjs/swagger';

export class ManufacturerResponseDto {
  @ApiProperty({ example: 1, description: 'Manufacturer ID' })
  id: number;

  @ApiProperty({ example: 'Samsung', description: 'Manufacturer name' })
  manufacturerName: string;

  @ApiProperty({
    example: 'Leading electronics manufacturer',
    description: 'Description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
