import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';
import { Type } from 'class-transformer';

export class DeviceStatusDto {
  @AutoMap()
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ required: true, description: 'device status id' })
  id: number;

  @AutoMap()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'device status title' })
  title: string;

  @AutoMap()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'unique slug' })
  slug: string;
}
