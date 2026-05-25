import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { MarketerDeviceSalePriceDto } from '../dto';
import { ZTMarketerDeviceSalePrice } from '@rahino/localdatabase/models';
import { Mapper, createMap } from 'automapper-core';

@Injectable()
export class MarketerDeviceSalePriceProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, MarketerDeviceSalePriceDto, ZTMarketerDeviceSalePrice);
    };
  }
}
