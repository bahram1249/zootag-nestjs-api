import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTCurrency, ZTCurrencyHistory } from '@rahino/localdatabase/models';
import { CurrencyCalculationService } from './currency-calculation.service';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([ZTCurrency, ZTCurrencyHistory])],
  providers: [CurrencyCalculationService],
  exports: [CurrencyCalculationService],
})
export class CurrencyCalculationModule {}
