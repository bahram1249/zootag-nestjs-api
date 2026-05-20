import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTContract } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';

@Module({
  imports: [SequelizeModule.forFeature([ZTContract, User, Permission])],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
