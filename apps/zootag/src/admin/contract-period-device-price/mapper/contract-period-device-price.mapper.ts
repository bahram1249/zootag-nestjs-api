import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ContractPeriodDevicePriceDto } from '../dto';
import { ZTContractPeriodDevicePrice } from '@rahino/localdatabase/models';
import { Mapper, createMap } from 'automapper-core';

@Injectable()
export class ContractPeriodDevicePriceProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        ContractPeriodDevicePriceDto,
        ZTContractPeriodDevicePrice,
      );
    };
  }
}
