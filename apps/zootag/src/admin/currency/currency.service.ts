import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTCurrency } from '@rahino/localdatabase/models';
import { CurrencyFilterDto, CurrencyDto } from './dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel(ZTCurrency)
    private readonly repository: typeof ZTCurrency,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

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

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter({ isActive: true })
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.currency_not_found'),
      );
    return { result: item };
  }

  async create(dto: CurrencyDto) {
    const item = await this.repository.create({
      code: dto.code,
      name: dto.name,
      symbol: dto.symbol,
      exchangeRateToIRR: dto.exchangeRateToIRR ?? 0,
      isBaseCurrency: dto.isBaseCurrency ?? false,
    });
    return { result: item };
  }

  async update(id: number, dto: CurrencyDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.currency_not_found'),
      );
    await item.update({
      code: dto.code,
      name: dto.name,
      symbol: dto.symbol,
      exchangeRateToIRR: dto.exchangeRateToIRR ?? 0,
      isBaseCurrency: dto.isBaseCurrency ?? false,
    });
    return { result: item };
  }

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
