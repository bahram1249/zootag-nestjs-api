import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTContractPeriodDevicePrice } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { ContractPeriodDevicePriceController } from './contract-period-device-price.controller';
import { ContractPeriodDevicePriceService } from './contract-period-device-price.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ZTContractPeriodDevicePrice,
      User,
      Permission,
    ]),
  ],
  controllers: [ContractPeriodDevicePriceController],
  providers: [ContractPeriodDevicePriceService],
})
export class ContractPeriodDevicePriceModule {}
