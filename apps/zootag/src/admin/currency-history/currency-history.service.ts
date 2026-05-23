import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTCurrency, ZTCurrencyHistory } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { CurrencyHistoryDto, CurrencyHistoryFilterDto } from './dto';

@Injectable()
export class CurrencyHistoryService {
  constructor(
    @InjectModel(ZTCurrencyHistory)
    private readonly repository: typeof ZTCurrencyHistory,
    @InjectModel(ZTCurrency)
    private readonly currencyRepository: typeof ZTCurrency,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: CurrencyHistoryFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({})
      .filterIf(!!filter.currencyId, { currencyId: filter.currencyId });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'currencyId',
        'exchangeRateToIRR',
        'createdUserId',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          model: ZTCurrency,
          as: 'currency',
          attributes: ['id', 'code', 'name', 'symbol'],
          required: false,
        },
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
        .attributes([
          'id',
          'currencyId',
          'exchangeRateToIRR',
          'createdUserId',
          'createdAt',
          'updatedAt',
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.currency_history_not_found'),
      );
    return { result: item };
  }

  /**
   * Creates a currency history record and updates the parent currency's exchange rate.
   * The currency must exist and be active.
   */
  async create(dto: CurrencyHistoryDto, user: User) {
    const currency = await this.currencyRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.currencyId })
        .filter({ isActive: true })
        .build(),
    );
    if (!currency)
      throw new BadRequestException(
        this.localizationService.translate('zootag.currency_not_found'),
      );

    const item = await this.repository.create({
      currencyId: BigInt(dto.currencyId),
      exchangeRateToIRR: dto.exchangeRateToIRR,
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });

    await currency.update({
      exchangeRateToIRR: dto.exchangeRateToIRR,
    });

    return { result: item };
  }
}
