import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTCommissionType } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { CommissionTypeController } from './commission-type.controller';
import { CommissionTypeService } from './commission-type.service';
import { CommissionTypeProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTCommissionType, User, Permission])],
  controllers: [CommissionTypeController],
  providers: [CommissionTypeService, CommissionTypeProfile],
})
export class CommissionTypeModule {}
