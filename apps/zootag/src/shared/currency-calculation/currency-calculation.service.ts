import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ZTCurrency } from '@rahino/localdatabase/models';

@Injectable()
export class CurrencyCalculationService {
  constructor(
    @InjectModel(ZTCurrency)
    private readonly currencyRepository: typeof ZTCurrency,
  ) {}

  async convertToIRR(amount: number, fromCurrencyId: bigint): Promise<number> {
    const currency = await this.currencyRepository.findByPk(fromCurrencyId);
    if (!currency) throw new Error('Currency not found');
    if (currency.isBaseCurrency) return amount;
    return amount * Number(currency.exchangeRateToIRR);
  }

  async convertFromIRR(amount: number, toCurrencyId: bigint): Promise<number> {
    const currency = await this.currencyRepository.findByPk(toCurrencyId);
    if (!currency) throw new Error('Currency not found');
    if (currency.isBaseCurrency) return amount;
    if (Number(currency.exchangeRateToIRR) === 0)
      throw new Error('Exchange rate is zero');
    return amount / Number(currency.exchangeRateToIRR);
  }

  async getDisplayPrice(
    amount: number,
    currencyId: bigint,
  ): Promise<{ amount: number; currency: ZTCurrency }> {
    const currency = await this.currencyRepository.findByPk(currencyId);
    if (!currency) throw new Error('Currency not found');
    return { amount, currency };
  }
}
