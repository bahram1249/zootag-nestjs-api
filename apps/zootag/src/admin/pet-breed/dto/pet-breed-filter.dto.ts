import { IntersectionType } from '@nestjs/swagger';
import { ListFilter, IgnorePagingFilter } from '@rahino/query-filter/types';

export class PetBreedFilterDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) { }
