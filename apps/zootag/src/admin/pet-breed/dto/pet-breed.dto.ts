import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';
export class PetBreedDto {
  @AutoMap()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'PetBreed name' })
  name: string;

  @AutoMap()
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'petType Id' })
  petTypeId: number;

}
