import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ContractPeriodStatusDto } from '../dto';
import { ZTContractPeriodStatus } from '@rahino/localdatabase/models';
import { Mapper, createMap } from 'automapper-core';

@Injectable()
export class ContractPeriodStatusProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ContractPeriodStatusDto, ZTContractPeriodStatus);
    };
  }
}
