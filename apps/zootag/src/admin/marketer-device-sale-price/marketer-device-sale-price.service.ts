import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import {
  ZTMarketerDeviceSalePrice,
  ZTMarketer,
  ZTDeviceType,
  ZTCurrency,
} from '@rahino/localdatabase/models';
import { CurrencyCalculationService } from '@rahino/zootag/shared/currency-calculation';
import {
  MarketerDeviceSalePriceFilterDto,
  MarketerDeviceSalePriceDto,
} from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class MarketerDeviceSalePriceService {
  constructor(
    @InjectModel(ZTMarketerDeviceSalePrice)
    private readonly repository: typeof ZTMarketerDeviceSalePrice,
    private readonly localizationService: LocalizationService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly currencyCalculationService: CurrencyCalculationService,
  ) {}

  async findAll(filter: MarketerDeviceSalePriceFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.deviceTypeId, { deviceTypeId: filter.deviceTypeId })
      .filterIf(!!filter.marketerId, { marketerId: filter.marketerId })
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [],
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id', 'marketerId', 'deviceTypeId', 'currencyId',
        'salePrice', 'salePriceIRR', 'validFrom', 'validTo', 'isActive',
      ])
      .include([
        {
          model: ZTMarketer,
          as: 'marketer',
          attributes: ['id', 'fullName'],
          required: false,
        },
        {
          model: ZTDeviceType,
          as: 'deviceType',
          attributes: ['id', 'typeName', 'modelCode'],
          required: false,
        },
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
        .filter({ isDeleted: 0 })
        .attributes([
          'id', 'marketerId', 'deviceTypeId', 'currencyId',
          'salePrice', 'salePriceIRR', 'validFrom', 'validTo', 'isActive',
        ])
        .include([
          {
            model: ZTMarketer,
            as: 'marketer',
            attributes: ['id', 'fullName'],
            required: false,
          },
          {
            model: ZTDeviceType,
            as: 'deviceType',
            attributes: ['id', 'typeName', 'modelCode'],
            required: false,
          },
          {
            model: ZTCurrency,
            as: 'currency',
            attributes: ['id', 'code', 'name', 'symbol'],
            required: false,
          },
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.marketer_device_sale_price_not_found',
        ),
      );
    return { result: item };
  }

  async create(dto: MarketerDeviceSalePriceDto) {
    const existing = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ marketerId: dto.marketerId })
        .filter({ deviceTypeId: dto.deviceTypeId })
        .filter({ isDeleted: 0 })
        .build(),
    );
    if (existing)
      throw new ConflictException(
        this.localizationService.translate(
          'zootag.marketer_device_sale_price_duplicate',
        ),
      );

    const salePriceIRR = await this.currencyCalculationService.convertToIRR(
      dto.salePrice,
      BigInt(dto.currencyId),
    );
    const mapped = this.mapper
      .map(dto, MarketerDeviceSalePriceDto, ZTMarketerDeviceSalePrice)
      .toJSON();
    const item = await this.repository.create({
      ...mapped,
      salePriceIRR,
    });
    return { result: item };
  }

  async update(id: number, dto: MarketerDeviceSalePriceDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.marketer_device_sale_price_not_found',
        ),
      );
    const salePriceIRR = await this.currencyCalculationService.convertToIRR(
      dto.salePrice,
      BigInt(dto.currencyId),
    );
    const mapped = this.mapper
      .map(dto, MarketerDeviceSalePriceDto, ZTMarketerDeviceSalePrice)
      .toJSON();
    await item.update({
      ...mapped,
      salePriceIRR,
    });
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.marketer_device_sale_price_not_found',
        ),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
