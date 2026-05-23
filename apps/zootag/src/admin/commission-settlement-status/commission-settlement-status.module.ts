import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTCommissionSettlementStatus } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { CommissionSettlementStatusController } from './commission-settlement-status.controller';
import { CommissionSettlementStatusService } from './commission-settlement-status.service';
import { CommissionSettlementStatusProfile } from './mapper';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ZTCommissionSettlementStatus,
      User,
      Permission,
    ]),
  ],
  controllers: [CommissionSettlementStatusController],
  providers: [
    CommissionSettlementStatusService,
    CommissionSettlementStatusProfile,
  ],
})
export class CommissionSettlementStatusModule {}
