import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTDeviceType } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { DeviceTypeController } from './device-type.controller';
import { DeviceTypeService } from './device-type.service';
import { DeviceTypeProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTDeviceType, User, Permission])],
  controllers: [DeviceTypeController],
  providers: [DeviceTypeService, DeviceTypeProfile],
})
export class DeviceTypeModule {}
