import { IntersectionType, ApiProperty } from '@nestjs/swagger';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';
import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ContractPeriodDevicePriceFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ required: false, description: 'filter by contract period id' })
  contractPeriodId?: number;
}
