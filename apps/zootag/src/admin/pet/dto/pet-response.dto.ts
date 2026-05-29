import { ApiProperty } from '@nestjs/swagger';

class PetBreedBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'German Shepherd' })
  name: string;
}

class PetTypeBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Dog' })
  name: string;
}

class DeviceBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'SN-12345' })
  serialNumber: string;
}

class OwnerBriefDto {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'john_doe' })
  username: string;
  @ApiProperty({ example: 'John' })
  firstname: string;
  @ApiProperty({ example: 'Doe' })
  lastname: string;
}

export class PetResponseDto {
  @ApiProperty({ example: 1, description: 'Pet ID' })
  id: number;

  @ApiProperty({ example: 'Max', description: 'Pet name' })
  name: string;

  @ApiProperty({ example: 1, description: 'Owner user ID' })
  ownerId: number;

  @ApiProperty({ description: 'Owner', type: () => OwnerBriefDto })
  owner: OwnerBriefDto;

  @ApiProperty({
    description: 'Breed',
    required: false,
    type: () => PetBreedBriefDto,
  })
  breed?: PetBreedBriefDto;

  @ApiProperty({ description: 'Pet type', type: () => PetTypeBriefDto })
  petType: PetTypeBriefDto;

  @ApiProperty({ description: 'Device', required: false, type: () => DeviceBriefDto })
  device?: DeviceBriefDto;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Birth date',
    required: false,
  })
  birthDate?: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
