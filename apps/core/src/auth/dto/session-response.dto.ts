import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty({ example: 1, description: 'Session ID' })
  id: string;

  @ApiProperty({ example: '192.168.1.1', description: 'IP address' })
  ipAddress: string;

  @ApiProperty({
    example: 'Mozilla/5.0...',
    description: 'User agent',
    required: false,
  })
  userAgent?: string;

  @ApiProperty({
    example: '2026-05-27T12:00:00.000Z',
    description: 'Session expiration',
  })
  expiresAt: Date;

  @ApiProperty({
    example: false,
    description: 'Whether the session is revoked',
  })
  isRevoked: boolean;

  @ApiProperty({
    example: '2026-05-20T12:30:00.000Z',
    description: 'Last activity timestamp',
    required: false,
  })
  lastActivityAt?: Date;

  @ApiProperty({
    example: '2026-05-20T12:00:00.000Z',
    description: 'Session creation timestamp',
  })
  createdAt: Date;
}
