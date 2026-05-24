import { IntersectionType, ApiProperty } from '@nestjs/swagger';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';
import { IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeviceSaleFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false, description: 'start date filter (ISO 8601)' })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false, description: 'end date filter (ISO 8601)' })
  endDate?: string;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, description: 'filter by marketer id' })
  marketerId?: number;
}
