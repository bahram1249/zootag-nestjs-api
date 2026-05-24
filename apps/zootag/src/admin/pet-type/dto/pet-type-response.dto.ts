import { ApiProperty } from '@nestjs/swagger';

export class PetTypeResponseDto {
  @ApiProperty({ example: 1, description: 'PetType ID' })
  id: number;

  @ApiProperty({ example: 'Dog', description: 'PetType name' })
  name: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
