import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import {
  ZTContractPeriodDevicePrice,
  ZTContractPeriod,
  ZTDeviceType,
  ZTCurrency,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { CurrencyCalculationService } from '@rahino/zootag/shared/currency-calculation';
import {
  ContractPeriodDevicePriceFilterDto,
  ContractPeriodDevicePriceDto,
} from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class ContractPeriodDevicePriceService {
  constructor(
    @InjectModel(ZTContractPeriodDevicePrice)
    private readonly repository: typeof ZTContractPeriodDevicePrice,
    private readonly localizationService: LocalizationService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly currencyCalculationService: CurrencyCalculationService,
  ) {}

  /**
   * Business rules:
   * - Only returns non-deleted price records (isDeleted = 0)
   * - Search matches contractPeriodId or deviceTypeId
   */
  async findAll(filter: ContractPeriodDevicePriceFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [
          { contractPeriodId: { [Op.like]: filter.search } },
          { deviceTypeId: { [Op.like]: filter.search } },
        ],
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'contractPeriodId',
        'deviceTypeId',
        'purchasePrice',
        'currencyId',
        'purchasePriceIRR',
        'minimumQuantity',
        'maximumQuantity',
        'sellingPrice',
        'sellingCurrencyId',
        'sellingPriceIRR',
        'isActive',
      ])
      .include([
        {
          model: ZTContractPeriod,
          as: 'contractPeriod',
          attributes: ['id', 'periodName'],
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
        {
          model: ZTCurrency,
          as: 'sellingCurrency',
          attributes: ['id', 'code', 'name', 'symbol'],
          required: false,
        },
        {
          model: User,
          as: 'createdUser',
          attributes: ['id', 'firstname', 'lastname'],
          required: false,
        },
        {
          model: User,
          as: 'updatedUser',
          attributes: ['id', 'firstname', 'lastname'],
          required: false,
        },
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  /**
   * Business rules:
   * - Only returns non-deleted price records
   */
  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter({ isDeleted: 0 })
        .attributes([
          'id',
          'contractPeriodId',
          'deviceTypeId',
          'purchasePrice',
          'currencyId',
          'purchasePriceIRR',
          'minimumQuantity',
          'maximumQuantity',
          'sellingPrice',
          'sellingCurrencyId',
          'sellingPriceIRR',
          'isActive',
        ])
        .include([
          {
            model: ZTContractPeriod,
            as: 'contractPeriod',
            attributes: ['id', 'periodName'],
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
          {
            model: ZTCurrency,
            as: 'sellingCurrency',
            attributes: ['id', 'code', 'name', 'symbol'],
            required: false,
          },
          {
            model: User,
            as: 'createdUser',
            attributes: ['id', 'firstname', 'lastname'],
            required: false,
          },
          {
            model: User,
            as: 'updatedUser',
            attributes: ['id', 'firstname', 'lastname'],
            required: false,
          },
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.contract_period_device_price_not_found',
        ),
      );
    return { result: item };
  }

  /**
   * Business rules:
   * - If purchasePrice + currencyId are provided but purchasePriceIRR is null,
   *   purchasePriceIRR is auto-calculated via currency exchange rate
   * - If sellingPrice + sellingCurrencyId are provided but sellingPriceIRR is null,
   *   sellingPriceIRR is auto-calculated similarly
   * - Sets audit fields from authenticated user
   */
  async create(dto: ContractPeriodDevicePriceDto, user: User) {
    let purchasePriceIRR = dto.purchasePriceIRR;
    if (
      dto.purchasePrice != null &&
      dto.currencyId != null &&
      purchasePriceIRR == null
    ) {
      purchasePriceIRR = await this.currencyCalculationService.convertToIRR(
        dto.purchasePrice,
        BigInt(dto.currencyId),
      );
    }
    let sellingPriceIRR = dto.sellingPriceIRR;
    if (
      dto.sellingPrice != null &&
      dto.sellingCurrencyId != null &&
      sellingPriceIRR == null
    ) {
      sellingPriceIRR = await this.currencyCalculationService.convertToIRR(
        dto.sellingPrice,
        BigInt(dto.sellingCurrencyId),
      );
    }
    const mapped = this.mapper
      .map(dto, ContractPeriodDevicePriceDto, ZTContractPeriodDevicePrice)
      .toJSON();
    const item = await this.repository.create({
      ...mapped,
      purchasePriceIRR: purchasePriceIRR ?? 0,
      sellingPriceIRR: sellingPriceIRR ?? null,
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  /**
   * Business rules:
   * - Only non-deleted price records can be updated
   * - purchasePriceIRR and sellingPriceIRR are FROZEN after creation — once set,
   *   they cannot be recalculated via update
   * - Sets updatedUserId from authenticated user
   */
  async update(id: number, dto: ContractPeriodDevicePriceDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.contract_period_device_price_not_found',
        ),
      );
    const mapped = this.mapper
      .map(dto, ContractPeriodDevicePriceDto, ZTContractPeriodDevicePrice)
      .toJSON();
    await item.update({
      ...mapped,
      purchasePriceIRR: item.purchasePriceIRR,
      sellingPriceIRR: item.sellingPriceIRR,
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  /**
   * Business rules:
   * - Soft delete: sets isDeleted = true instead of hard-deleting
   */
  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.contract_period_device_price_not_found',
        ),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
