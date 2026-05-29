import { ApiProperty } from '@nestjs/swagger';

export class PetTypeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Dog' })
  name: string;
}
