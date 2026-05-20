import { IntersectionType } from '@nestjs/swagger';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';

export class DeviceFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
