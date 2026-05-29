import { ApiProperty } from '@nestjs/swagger';

class PetTypeBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Dog' })
  name: string;
}

export class PetBreedResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'German Shepherd' })
  name: string;

  @ApiProperty({ type: () => PetTypeBriefDto })
  petType: PetTypeBriefDto;
}
