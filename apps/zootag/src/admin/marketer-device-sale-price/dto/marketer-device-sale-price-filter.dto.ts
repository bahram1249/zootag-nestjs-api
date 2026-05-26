import { IntersectionType, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';

export class MarketerDeviceSalePriceFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'filter by device sale price id' })
  deviceSalePriceId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'filter by marketer id' })
  marketerId?: number;
}
