import { IntersectionType, ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ required: false, description: 'filter by device type id' })
  deviceTypeId?: number;
}

export class EffectivePriceQueryDto {
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ description: 'device type id' })
  deviceTypeId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiProperty({
    required: false,
    description: 'marketer id for override lookup',
  })
  marketerId?: number;
}
