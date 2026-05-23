import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ZTDeviceSalePrice,
  ZTDeviceType,
  ZTCompany,
  ZTContractPeriod,
  ZTCurrency,
} from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { DeviceSalePriceController } from './device-sale-price.controller';
import { DeviceSalePriceService } from './device-sale-price.service';
import { DeviceSalePriceProfile } from './mapper';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ZTDeviceSalePrice,
      ZTDeviceType,
      ZTCompany,
      ZTContractPeriod,
      ZTCurrency,
      User,
      Permission,
    ]),
  ],
  controllers: [DeviceSalePriceController],
  providers: [DeviceSalePriceService, DeviceSalePriceProfile],
})
export class DeviceSalePriceModule {}
