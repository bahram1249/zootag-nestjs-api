import { IntersectionType } from '@nestjs/swagger';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';

export class InventoryStatusFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
