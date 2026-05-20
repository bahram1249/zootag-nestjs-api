import { IntersectionType } from '@nestjs/swagger';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';

export class DeviceStatusFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
