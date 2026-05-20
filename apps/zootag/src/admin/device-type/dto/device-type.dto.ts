import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';

export class DeviceTypeDto {
  @AutoMap()
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'device type name' })
  typeName: string;

  @AutoMap()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'model code' })
  modelCode: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'description' })
  description?: string;
}
