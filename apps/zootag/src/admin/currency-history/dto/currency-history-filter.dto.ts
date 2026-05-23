import { IntersectionType, ApiProperty } from '@nestjs/swagger';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';
import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CurrencyHistoryFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ required: false, description: 'filter by currency id' })
  currencyId?: number;
}
