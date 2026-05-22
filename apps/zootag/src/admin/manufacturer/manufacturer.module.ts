import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTManufacturer } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { ManufacturerController } from './manufacturer.controller';
import { ManufacturerService } from './manufacturer.service';
import { ManufacturerProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTManufacturer, User, Permission])],
  controllers: [ManufacturerController],
  providers: [ManufacturerService, ManufacturerProfile],
})
export class ManufacturerModule {}
