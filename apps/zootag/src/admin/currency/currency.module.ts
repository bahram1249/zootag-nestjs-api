import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTCurrency } from '@rahino/localdatabase/models';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

@Module({
  imports: [SequelizeModule.forFeature([ZTCurrency])],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}
