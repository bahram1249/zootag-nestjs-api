import { ApiProperty } from '@nestjs/swagger';

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
}
