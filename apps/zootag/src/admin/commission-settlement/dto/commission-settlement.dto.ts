import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from 'automapper-classes';

export class CommissionSettlementDto {
  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'marketer id' })
  marketerId: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'device sale id' })
  deviceSaleId: number;

  @AutoMap()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'amount IRR' })
  amountIRR: number;

  @AutoMap()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'payment date' })
  paymentDate: string;

  @AutoMap()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'status id' })
  statusId?: number;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'notes' })
  notes?: string;
}
