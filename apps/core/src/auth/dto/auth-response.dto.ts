import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({
    example: 900,
    description: 'Access token lifetime in seconds',
  })
  expires_in: number;

  @ApiProperty({
    example: '2026-05-20T12:00:00.000Z',
    description: 'Access token expiration timestamp',
  })
  expires_at: Date;

  @ApiProperty({
    example: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...',
    description: 'Refresh token',
  })
  refresh_token: string;

  @ApiProperty({
    example: '2026-05-27T12:00:00.000Z',
    description: 'Refresh token expiration timestamp',
  })
  refresh_token_expires_at: Date;

  @ApiProperty({
    example: 1,
    description: 'Session ID',
  })
  session_id: number;
}
