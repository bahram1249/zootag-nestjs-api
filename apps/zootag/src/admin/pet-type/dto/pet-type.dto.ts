import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';
import { Type } from 'class-transformer';

export class PetTypeDto {

  @AutoMap()
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({ description: 'contract id' })
  id: number;

  @AutoMap()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'PetType name' })
  name: string;
}
