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

export class ContractStatusDto {
  @AutoMap()
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'contract status id' })
  id: number;

  @AutoMap()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'contract status name' })
  name: string;
}
