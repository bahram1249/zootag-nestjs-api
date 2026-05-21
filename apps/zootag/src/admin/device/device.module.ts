import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTDevice, ZTContractPeriodDevicePrice } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { DeviceProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTDevice, ZTContractPeriodDevicePrice, User, Permission])],
  controllers: [DeviceController],
  providers: [DeviceService, DeviceProfile],
})
export class DeviceModule {}
