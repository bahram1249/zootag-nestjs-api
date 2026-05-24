import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ZTDeviceSale,
  ZTDevice,
  ZTMarketer,
  ZTMarketerCommission,
  ZTCompany,
  ZTCurrency,
  ZTCommissionType,
  ZTInventoryStatus,
} from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { DeviceSaleController } from './device-sale.controller';
import { DeviceSaleService } from './device-sale.service';
import { DeviceSaleProfile } from './mapper';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ZTDeviceSale,
      ZTDevice,
      ZTMarketer,
      ZTCompany,
      ZTCurrency,
      ZTCommissionType,
      ZTInventoryStatus,
      ZTMarketerCommission,
      User,
      Permission,
    ]),
  ],
  controllers: [DeviceSaleController],
  providers: [DeviceSaleService, DeviceSaleProfile],
})
export class DeviceSaleModule {}
