import { ApiProperty } from '@nestjs/swagger';

export class RevokeSessionResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates whether session was revoked successfully',
  })
  success: boolean;
}
