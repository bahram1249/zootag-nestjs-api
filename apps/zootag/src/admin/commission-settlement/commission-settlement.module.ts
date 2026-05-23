import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ZTCommissionSettlement,
  ZTMarketer,
  ZTDeviceSale,
} from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { CommissionSettlementController } from './commission-settlement.controller';
import { CommissionSettlementService } from './commission-settlement.service';
import { CommissionSettlementProfile } from './mapper';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ZTCommissionSettlement,
      ZTMarketer,
      ZTDeviceSale,
      User,
      Permission,
    ]),
  ],
  controllers: [CommissionSettlementController],
  providers: [CommissionSettlementService, CommissionSettlementProfile],
})
export class CommissionSettlementModule {}
