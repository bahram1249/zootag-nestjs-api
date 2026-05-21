import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTDeviceStatus } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { DeviceStatusController } from './device-status.controller';
import { DeviceStatusService } from './device-status.service';
import { DeviceStatusProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTDeviceStatus, User, Permission])],
  controllers: [DeviceStatusController],
  providers: [DeviceStatusService, DeviceStatusProfile],
})
export class DeviceStatusModule {}
