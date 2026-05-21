import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ContractDto } from '../dto';
import { ZTContract } from '@rahino/localdatabase/models';
import { Mapper, createMap } from 'automapper-core';

@Injectable()
export class ContractProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ContractDto, ZTContract);
    };
  }
}
