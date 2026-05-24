import { ApiProperty } from '@nestjs/swagger';
import { ZTPetType } from '@rahino/localdatabase/models';


class PetTypeBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Q1 2026' })
  name: string;
}


export class PetBreedResponseDto {
  @ApiProperty({ example: 1, description: 'PetBreed ID' })
  id: number;

  @ApiProperty({ example: 'German Shepherd', description: 'PetBreed name' })
  name: string;

  @ApiProperty({ type: () => PetTypeBriefDto, description: 'PetType' })
  petType: PetTypeBriefDto;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}

