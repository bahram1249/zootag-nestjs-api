import { ApiProperty } from '@nestjs/swagger';

export class MarketerResponseDto {
  @ApiProperty({ example: 1, description: 'Marketer ID' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  fullName: string;

  @ApiProperty({
    example: '09123456789',
    description: 'Mobile',
    required: false,
  })
  mobile?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'National code',
    required: false,
  })
  nationalCode?: string;

  @ApiProperty({
    example: 1,
    description: 'Default commission type id',
    required: false,
  })
  defaultCommissionTypeId?: number;

  @ApiProperty({
    example: 10,
    description: 'Default commission value',
    required: false,
  })
  defaultCommissionValue?: number;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;
}
