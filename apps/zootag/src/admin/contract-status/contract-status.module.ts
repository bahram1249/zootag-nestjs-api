import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTContractStatus } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { ContractStatusController } from './contract-status.controller';
import { ContractStatusService } from './contract-status.service';
import { ContractStatusProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTContractStatus, User, Permission])],
  controllers: [ContractStatusController],
  providers: [ContractStatusService, ContractStatusProfile],
})
export class ContractStatusModule {}
