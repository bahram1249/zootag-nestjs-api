import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTCurrency, ZTCurrencyHistory } from '@rahino/localdatabase/models';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { Permission, User } from '@rahino/database';
import { CurrencyProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTCurrency, ZTCurrencyHistory, User, Permission])],
  controllers: [CurrencyController],
  providers: [CurrencyService, CurrencyProfile],
})
export class CurrencyModule {}
