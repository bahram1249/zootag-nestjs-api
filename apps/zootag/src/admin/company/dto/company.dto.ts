import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';

export class CompanyDto {
  @AutoMap()
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'company name' })
  companyName: string;

  @AutoMap()
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'legal name' })
  legalName: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ required: false, description: 'tax number' })
  taxNumber?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiProperty({ required: false, description: 'email' })
  email?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ required: false, description: 'phone' })
  phone?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'address' })
  address?: string;
}
