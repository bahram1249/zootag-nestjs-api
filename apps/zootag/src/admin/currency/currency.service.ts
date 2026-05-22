import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTCurrency, ZTCurrencyHistory } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { CurrencyFilterDto, CurrencyDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel(ZTCurrency)
    private readonly repository: typeof ZTCurrency,
    @InjectModel(ZTCurrencyHistory)
    private readonly currencyHistoryRepository: typeof ZTCurrencyHistory,
    private readonly localizationService: LocalizationService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Business rules:
   * - Only returns active currencies (isActive = true) — no isDeleted filter
   * - Currencies are never hard-deleted, only deactivated
   */
  async findAll(filter: CurrencyFilterDto) {
    let qb = new QueryOptionsBuilder().filter({ isActive: true });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'code',
        'name',
        'symbol',
        'exchangeRateToIRR',
        'isBaseCurrency',
        'isActive',
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  /**
   * Business rules:
   * - Only returns active currencies
   */
  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter({ isActive: true })
        .attributes([
          'id',
          'code',
          'name',
          'symbol',
          'exchangeRateToIRR',
          'isBaseCurrency',
          'isActive',
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.currency_not_found'),
      );
    return { result: item };
  }

  /**
   * Business rules:
   * - exchangeRateToIRR defaults to 0 if not provided
   * - isBaseCurrency defaults to false
   * - If exchangeRateToIRR is provided and currency is NOT base currency,
   *   a CurrencyHistory record is created to track the rate
   * - Base currencies do NOT create history entries
   */
  async create(dto: CurrencyDto, user: User) {
    const mapped = this.mapper.map(dto, CurrencyDto, ZTCurrency).toJSON();
    const item = await this.repository.create({
      ...mapped,
      exchangeRateToIRR: dto.exchangeRateToIRR ?? 0,
      isBaseCurrency: dto.isBaseCurrency ?? false,
    });
    if (dto.exchangeRateToIRR != null && !dto.isBaseCurrency) {
      await this.currencyHistoryRepository.create({
        currencyId: item.id,
        exchangeRateToIRR: dto.exchangeRateToIRR,
        createdUserId: BigInt(user.id),
        updatedUserId: BigInt(user.id),
      });
    }
    return { result: item };
  }

  /**
   * Business rules:
   * - If exchangeRateToIRR has changed and currency is NOT base currency,
   *   a new CurrencyHistory record is created to log the rate change
   * - Base currencies do NOT create history entries
   */
  async update(id: number, dto: CurrencyDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.currency_not_found'),
      );
    const rateChanged =
      dto.exchangeRateToIRR != null &&
      Number(dto.exchangeRateToIRR) !== Number(item.exchangeRateToIRR);
    const mapped = this.mapper.map(dto, CurrencyDto, ZTCurrency).toJSON();
    await item.update({
      ...mapped,
      exchangeRateToIRR: dto.exchangeRateToIRR ?? 0,
      isBaseCurrency: dto.isBaseCurrency ?? false,
    });
    if (rateChanged && !dto.isBaseCurrency) {
      await this.currencyHistoryRepository.create({
        currencyId: item.id,
        exchangeRateToIRR: dto.exchangeRateToIRR,
        createdUserId: BigInt(user.id),
        updatedUserId: BigInt(user.id),
      });
    }
    return { result: item };
  }

  /**
   * Business rules:
   * - Deactivation: sets isActive = false instead of deleting the row
   * - Preserves historical exchange rate data
   */
  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.currency_not_found'),
      );
    item.isActive = false;
    await item.save();
    return { result: item };
  }
}
