import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ManufacturerDto } from '../dto';
import { ZTManufacturer } from '@rahino/localdatabase/models';
import { Mapper, createMap } from 'automapper-core';

@Injectable()
export class ManufacturerProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ManufacturerDto, ZTManufacturer);
    };
  }
}
