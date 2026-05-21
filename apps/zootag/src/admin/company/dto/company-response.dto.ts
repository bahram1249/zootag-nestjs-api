import { ApiProperty } from '@nestjs/swagger';

class UserBriefDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;
  @ApiProperty({ example: 'John', description: 'First name' })
  firstname: string;
  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastname: string;
}

export class CompanyResponseDto {
  @ApiProperty({ example: 1, description: 'Company ID' })
  id: number;

  @ApiProperty({ example: 'PetTrack Inc.', description: 'Company name' })
  companyName: string;

  @ApiProperty({ example: 'PetTrack Ltd.', description: 'Legal name' })
  legalName: string;

  @ApiProperty({
    example: '123456789',
    description: 'Tax number',
    required: false,
  })
  taxNumber?: string;

  @ApiProperty({
    example: 'info@pettrack.com',
    description: 'Email',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: '+98-21-12345678',
    description: 'Phone',
    required: false,
  })
  phone?: string;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({
    type: () => UserBriefDto,
    description: 'Created user',
    required: false,
  })
  createdUser?: UserBriefDto;

  @ApiProperty({
    type: () => UserBriefDto,
    description: 'Updated user',
    required: false,
  })
  updatedUser?: UserBriefDto;
}
