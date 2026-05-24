import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ZTPetBreed } from '@rahino/localdatabase/models';
import { Mapper, createMap } from 'automapper-core';
import { PetBreedDto } from '../dto';

@Injectable()
export class PetBreedProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, PetBreedDto, ZTPetBreed);
    };
  }
}
