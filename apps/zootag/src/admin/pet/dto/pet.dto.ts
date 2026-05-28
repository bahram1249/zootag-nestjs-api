import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from 'automapper-classes';

export class PetDto {
  @AutoMap()
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'pet name' })
  name: string;

  @AutoMap()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: 'owner user id' })
  ownerId: number;

  @AutoMap()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: 'breed id' })
  breedId: number;

  @AutoMap()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ description: 'pet type id' })
  petTypeId: number;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'birth date (YYYY-MM-DD)' })
  birthDate?: string;
}
