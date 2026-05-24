import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ZTPetType } from '@rahino/localdatabase/models';
import { Mapper, createMap, forMember, mapFrom } from 'automapper-core';
import { PetTypeDto } from '../dto';

@Injectable()
export class PetTypeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, PetTypeDto, ZTPetType, forMember(d => d.id, mapFrom(src => BigInt(src.id))))

    };
  }
}
