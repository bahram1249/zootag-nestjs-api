import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTMarketer } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { MarketerController } from './marketer.controller';
import { MarketerService } from './marketer.service';
import { MarketerProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTMarketer, User, Permission])],
  controllers: [MarketerController],
  providers: [MarketerService, MarketerProfile],
})
export class MarketerModule {}
