import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTCurrency, ZTCurrencyHistory } from '@rahino/localdatabase/models';
import { CurrencyHistoryController } from './currency-history.controller';
import { CurrencyHistoryService } from './currency-history.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ZTCurrencyHistory,
      ZTCurrency,
      User,
      Permission,
    ]),
  ],
  controllers: [CurrencyHistoryController],
  providers: [CurrencyHistoryService],
})
export class CurrencyHistoryModule {}
