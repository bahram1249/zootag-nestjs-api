import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';

export class ManufacturerDto {
  @AutoMap()
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'manufacturer name' })
  manufacturerName: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'description' })
  description?: string;
}
