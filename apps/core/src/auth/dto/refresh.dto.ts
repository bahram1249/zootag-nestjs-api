import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'refresh token',
  })
  refresh_token: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'session ID',
  })
  sessionId: number;
}
