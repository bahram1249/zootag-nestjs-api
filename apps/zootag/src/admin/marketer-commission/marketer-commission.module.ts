import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTMarketerCommission } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { MarketerCommissionController } from './marketer-commission.controller';
import { MarketerCommissionService } from './marketer-commission.service';
import { MarketerCommissionProfile } from './mapper';

@Module({
  imports: [
    SequelizeModule.forFeature([ZTMarketerCommission, User, Permission]),
  ],
  controllers: [MarketerCommissionController],
  providers: [MarketerCommissionService, MarketerCommissionProfile],
})
export class MarketerCommissionModule {}
