import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import {
  ZTDeviceSalePrice,
  ZTDeviceType,
  ZTCompany,
  ZTContractPeriod,
  ZTCurrency,
  ZTMarketerDeviceSalePrice,
  ZTMarketer,
} from '@rahino/localdatabase/models';
import { CurrencyCalculationService } from '@rahino/zootag/shared/currency-calculation';
import { DeviceSalePriceFilterDto, DeviceSalePriceDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class DeviceSalePriceService {
  constructor(
    @InjectModel(ZTDeviceSalePrice)
    private readonly repository: typeof ZTDeviceSalePrice,
    @InjectModel(ZTMarketerDeviceSalePrice)
    private readonly marketerPriceRepository: typeof ZTMarketerDeviceSalePrice,
    private readonly localizationService: LocalizationService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly currencyCalculationService: CurrencyCalculationService,
  ) {}

  async findAll(filter: DeviceSalePriceFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filterIf(!!filter.deviceTypeId, { deviceTypeId: filter.deviceTypeId })
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [],
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'deviceTypeId',
        'companyId',
        'contractPeriodId',
        'currencyId',
        'salePrice',
        'salePriceIRR',
        'validFrom',
        'validTo',
        'isActive',
      ])
      .include([
        {
          model: ZTDeviceType,
          as: 'deviceType',
          attributes: ['id', 'typeName', 'modelCode'],
          required: false,
        },
        {
          model: ZTCompany,
          as: 'company',
          attributes: ['id', 'companyName'],
          required: false,
        },
        {
          model: ZTContractPeriod,
          as: 'contractPeriod',
          attributes: ['id', 'periodName'],
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

  async findEffective(deviceTypeId: number, marketerId?: number) {
    const now = new Date();

    const qb = new QueryOptionsBuilder()
      .filter({ deviceTypeId })
      .filter({ isActive: true })
      .filter({ validFrom: { [Op.lte]: now } })
      .filter({
        [Op.or]: [
          { validTo: null },
          { validTo: { [Op.gte]: now } },
        ],
      });
    const total = await this.repository.count(qb.build());
    const deviceSalePrices = await this.repository.findAll(
      qb
        .attributes([
          'id', 'deviceTypeId', 'companyId', 'contractPeriodId',
          'currencyId', 'salePrice', 'salePriceIRR',
          'validFrom', 'validTo', 'isActive',
        ])
        .include([
          {
            model: ZTDeviceType,
            as: 'deviceType',
            attributes: ['id', 'typeName', 'modelCode'],
            required: false,
          },
          {
            model: ZTCompany,
            as: 'company',
            attributes: ['id', 'companyName'],
            required: false,
          },
          {
            model: ZTContractPeriod,
            as: 'contractPeriod',
            attributes: ['id', 'periodName'],
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

    if (marketerId && deviceSalePrices.length > 0) {
      const deviceSalePriceIds = deviceSalePrices.map((p) => Number(p.id));
      const marketerPrices = await this.marketerPriceRepository.findAll(
        new QueryOptionsBuilder()
          .filter({ isDeleted: 0 })
          .filter({ marketerId })
          .filter({ isActive: true })
          .filter({ deviceSalePriceId: { [Op.in]: deviceSalePriceIds } })
          .attributes([
            'id', 'marketerId', 'deviceSalePriceId', 'currencyId',
            'salePrice', 'salePriceIRR', 'isActive',
          ])
          .build(),
      );

      const overrideMap = new Map<number, (typeof marketerPrices)[0]>();
      for (const mp of marketerPrices) {
        overrideMap.set(Number(mp.deviceSalePriceId), mp);
      }

      const merged = deviceSalePrices.map((dsp) => {
        const override = overrideMap.get(Number(dsp.id));
        if (override) {
          return { ...override.toJSON(), priceType: 'marketer' as const };
        }
        return { ...dsp.toJSON(), priceType: 'default' as const };
      });

      return { result: merged, total: merged.length };
    }

    return {
      result: deviceSalePrices.map((p) => ({
        ...p.toJSON(),
        priceType: 'default' as const,
      })),
      total,
    };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .attributes([
          'id',
          'deviceTypeId',
          'companyId',
          'contractPeriodId',
          'currencyId',
          'salePrice',
          'salePriceIRR',
          'validFrom',
          'validTo',
          'isActive',
        ])
        .include([
          {
            model: ZTDeviceType,
            as: 'deviceType',
            attributes: ['id', 'typeName', 'modelCode'],
            required: false,
          },
          {
            model: ZTCompany,
            as: 'company',
            attributes: ['id', 'companyName'],
            required: false,
          },
          {
            model: ZTContractPeriod,
            as: 'contractPeriod',
            attributes: ['id', 'periodName'],
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
          'zootag.device_sale_price_not_found',
        ),
      );
    return { result: item };
  }

  async create(dto: DeviceSalePriceDto) {
    const mapped = this.mapper
      .map(dto, DeviceSalePriceDto, ZTDeviceSalePrice)
      .toJSON();
    const salePriceIRR = await this.currencyCalculationService.convertToIRR(
      dto.salePrice,
      BigInt(dto.currencyId),
    );

    const transaction = await this.sequelize.transaction();

    try {
      // Close previous active price for same deviceType+company+contractPeriod combination
      if (dto.deviceTypeId && dto.companyId && dto.contractPeriodId) {
        const previousActive = await this.repository.findOne(
          new QueryOptionsBuilder()
            .filter({ deviceTypeId: dto.deviceTypeId })
            .filter({ companyId: dto.companyId })
            .filter({ contractPeriodId: dto.contractPeriodId })
            .filter({ isActive: true })
            .filter({ validTo: null })
            .transaction(transaction)
            .build(),
        );
        if (previousActive) {
          await previousActive.update(
            { validTo: new Date(), isActive: false },
            { transaction },
          );
        }
      }

      const item = await this.repository.create(
        {
          ...mapped,
          salePriceIRR,
        },
        { transaction },
      );

      await transaction.commit();
      return { result: item };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
