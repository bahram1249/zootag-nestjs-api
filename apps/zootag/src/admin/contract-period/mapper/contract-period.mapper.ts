import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ContractPeriodDto } from '../dto';
import { ZTContractPeriod } from '@rahino/localdatabase/models';
import { Mapper, createMap } from 'automapper-core';

@Injectable()
export class ContractPeriodProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ContractPeriodDto, ZTContractPeriod);
    };
  }
}
