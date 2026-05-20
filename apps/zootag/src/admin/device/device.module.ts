import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTDevice } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
  imports: [SequelizeModule.forFeature([ZTDevice, User, Permission])],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
