import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';

export class DeviceTypeDto {
  @AutoMap()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'device type title' })
  title: string;

  @AutoMap()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'unique slug' })
  slug: string;
}
