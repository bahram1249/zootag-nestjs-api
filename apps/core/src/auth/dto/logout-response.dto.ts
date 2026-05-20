import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates whether logout was successful',
  })
  success: boolean;
}
