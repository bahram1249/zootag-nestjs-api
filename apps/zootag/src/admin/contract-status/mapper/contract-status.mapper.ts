import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ContractStatusDto } from '../dto';
import { ZTContractStatus } from '@rahino/localdatabase/models';
import { Mapper, createMap } from 'automapper-core';

@Injectable()
export class ContractStatusProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ContractStatusDto, ZTContractStatus);
    };
  }
}
