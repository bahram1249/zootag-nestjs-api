import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTContractPeriod } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { ContractPeriodController } from './contract-period.controller';
import { ContractPeriodService } from './contract-period.service';

@Module({
  imports: [SequelizeModule.forFeature([ZTContractPeriod, User, Permission])],
  controllers: [ContractPeriodController],
  providers: [ContractPeriodService],
})
export class ContractPeriodModule {}
