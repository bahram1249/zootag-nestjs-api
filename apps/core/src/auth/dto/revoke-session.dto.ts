import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RevokeSessionDto {
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'session ID',
  })
  sessionId: bigint;
}
