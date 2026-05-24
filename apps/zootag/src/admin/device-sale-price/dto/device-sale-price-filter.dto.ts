import { IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';

export class DeviceSalePriceFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  deviceTypeId?: number;
}
