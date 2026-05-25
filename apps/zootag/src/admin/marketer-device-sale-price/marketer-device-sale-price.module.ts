import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ZTMarketerDeviceSalePrice,
  ZTMarketer,
  ZTDeviceType,
  ZTCurrency,
} from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { MarketerDeviceSalePriceController } from './marketer-device-sale-price.controller';
import { MarketerDeviceSalePriceService } from './marketer-device-sale-price.service';
import { MarketerDeviceSalePriceProfile } from './mapper';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ZTMarketerDeviceSalePrice,
      ZTMarketer,
      ZTDeviceType,
      ZTCurrency,
      User,
      Permission,
    ]),
  ],
  controllers: [MarketerDeviceSalePriceController],
  providers: [MarketerDeviceSalePriceService, MarketerDeviceSalePriceProfile],
})
export class MarketerDeviceSalePriceModule {}
