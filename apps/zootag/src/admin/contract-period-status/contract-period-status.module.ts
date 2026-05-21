import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTContractPeriodStatus } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { ContractPeriodStatusController } from './contract-period-status.controller';
import { ContractPeriodStatusService } from './contract-period-status.service';
import { ContractPeriodStatusProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTContractPeriodStatus, User, Permission])],
  controllers: [ContractPeriodStatusController],
  providers: [ContractPeriodStatusService, ContractPeriodStatusProfile],
})
export class ContractPeriodStatusModule {}
