import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: IsString,
    description: 'refresh token',
  })
  refresh_token: string;
}
