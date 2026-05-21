import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { LocalizationMapperService } from '@rahino/zootag/shared/localization-mapper';
import {
  ZTDevice,
  ZTCompany,
  ZTDeviceType,
  ZTContractPeriod,
  ZTContractPeriodDevicePrice,
  ZTCurrency,
  ZTDeviceStatus,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { CurrencyCalculationService } from '@rahino/zootag/shared/currency-calculation';
import { DeviceFilterDto, DeviceDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(ZTDevice)
    private readonly repository: typeof ZTDevice,
    @InjectModel(ZTContractPeriodDevicePrice)
    private readonly contractPeriodDevicePriceRepository: typeof ZTContractPeriodDevicePrice,
    private readonly localizationService: LocalizationService,
    private readonly localizationMapperService: LocalizationMapperService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly currencyCalculationService: CurrencyCalculationService,
  ) {}

  /**
   * Business rules:
   * - Only returns non-deleted devices (isDeleted = 0)
   * - Search matches serialNumber or IMEI
   * - deviceStatus names are localized via i18n
   */
  async findAll(filter: DeviceFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [
          { serialNumber: { [Op.like]: filter.search } },
          { imei: { [Op.like]: filter.search } },
        ],
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'serialNumber',
        'imei',
        'macAddress',
        'companyId',
        'deviceTypeId',
        'contractPeriodId',
        'contractPeriodDevicePriceId',
        'purchasePrice',
        'currencyId',
        'purchasePriceIRR',
        'sellingPrice',
        'sellingCurrencyId',
        'sellingPriceIRR',
        'purchaseDate',
        'warrantyEndDate',
        'deviceStatusId',
        'isActive',
      ])
      .include([
        {
          model: ZTCompany,
          as: 'company',
          attributes: ['id', 'companyName'],
          required: false,
        },
        {
          model: ZTDeviceType,
          as: 'deviceType',
          attributes: ['id', 'typeName', 'modelCode'],
          required: false,
        },
        {
          model: ZTContractPeriod,
          as: 'contractPeriod',
          attributes: ['id', 'periodName'],
          required: false,
        },
        {
          model: ZTContractPeriodDevicePrice,
          as: 'contractPeriodDevicePrice',
          attributes: ['id', 'purchasePrice'],
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
          model: ZTDeviceStatus,
          as: 'deviceStatus',
          attributes: ['id', 'name'],
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
    const result = this.localizationMapperService.localizeItems(
      (await this.repository.findAll(qb.build())).map((r) => r.toJSON()),
      { deviceStatus: 'deviceStatus' },
    );
    return { result, total };
  }

  /**
   * Business rules:
   * - Only returns non-deleted devices
   * - deviceStatus names are localized via i18n
   */
  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter({ isDeleted: 0 })
        .include([
          {
            model: ZTCompany,
            as: 'company',
            attributes: ['id', 'companyName'],
            required: false,
          },
          {
            model: ZTDeviceType,
            as: 'deviceType',
            attributes: ['id', 'typeName', 'modelCode'],
            required: false,
          },
          {
            model: ZTContractPeriod,
            as: 'contractPeriod',
            attributes: ['id', 'periodName'],
            required: false,
          },
          {
            model: ZTContractPeriodDevicePrice,
            as: 'contractPeriodDevicePrice',
            attributes: ['id', 'purchasePrice'],
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
            model: ZTDeviceStatus,
            as: 'deviceStatus',
            attributes: ['id', 'name'],
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
        this.localizationService.translate('zootag.device_not_found'),
      );
    return {
      result: this.localizationMapperService.localizeItem(item.toJSON(), {
        deviceStatus: 'deviceStatus',
      }),
    };
  }

  /**
   * Business rules:
   * - contractPeriodDevicePriceId must reference an existing, non-deleted price record
   * - deviceTypeId must match the price record's deviceTypeId (prevents incorrect pricing)
   * - maximumQuantity on price record is enforced: if > 0, rejects when at or above limit
   * - Pricing fields (purchasePrice, currencyId, purchasePriceIRR, sellingPrice, etc.)
   *   are derived from the price record, NOT from user input
   * - contractPeriodId is set automatically from the price record
   */
  async create(dto: DeviceDto, user: User) {
    const priceRecord = await this.contractPeriodDevicePriceRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.contractPeriodDevicePriceId })
        .filter({ isDeleted: 0 })
        .build(),
    );
    if (!priceRecord)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.contract_period_device_price_not_found',
        ),
      );
    if (Number(priceRecord.deviceTypeId) !== Number(dto.deviceTypeId))
      throw new BadRequestException(
        this.localizationService.translate('zootag.device_type_mismatch'),
      );
    if (priceRecord.maximumQuantity > 0) {
      const deviceCount = await this.repository.count(
        new QueryOptionsBuilder()
          .filter({
            contractPeriodDevicePriceId: dto.contractPeriodDevicePriceId,
          })
          .filter({ isDeleted: 0 })
          .build(),
      );
      if (deviceCount >= priceRecord.maximumQuantity)
        throw new BadRequestException(
          this.localizationService.translate('zootag.maximum_quantity_reached'),
        );
    }
    const mapped = this.mapper.map(dto, DeviceDto, ZTDevice).toJSON();
    const item = await this.repository.create({
      ...mapped,
      contractPeriodId: priceRecord.contractPeriodId,
      purchasePrice: priceRecord.purchasePrice,
      currencyId: priceRecord.currencyId,
      purchasePriceIRR: priceRecord.purchasePriceIRR,
      sellingPrice: priceRecord.sellingPrice,
      sellingCurrencyId: priceRecord.sellingCurrencyId,
      sellingPriceIRR: priceRecord.sellingPriceIRR,
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  /**
   * Business rules:
   * - contractPeriodDevicePriceId is FROZEN — cannot be changed after creation
   * - All pricing and contract fields (contractPeriodId, deviceTypeId, purchasePrice,
   *   currencyId, purchasePriceIRR, sellingPrice, sellingCurrencyId, sellingPriceIRR)
   *   are FROZEN — only device descriptor fields (serialNumber, imei, macAddress, etc.)
   *   and status fields are mutable
   */
  async update(id: number, dto: DeviceDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_not_found'),
      );
    const mapped = this.mapper.map(dto, DeviceDto, ZTDevice).toJSON();
    await item.update({
      ...mapped,
      contractPeriodDevicePriceId: item.contractPeriodDevicePriceId,
      contractPeriodId: item.contractPeriodId,
      deviceTypeId: item.deviceTypeId,
      purchasePrice: item.purchasePrice,
      currencyId: item.currencyId,
      purchasePriceIRR: item.purchasePriceIRR,
      sellingPrice: item.sellingPrice,
      sellingCurrencyId: item.sellingCurrencyId,
      sellingPriceIRR: item.sellingPriceIRR,
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  /**
   * Business rules:
   * - Soft delete: sets isDeleted = true instead of hard-deleting the row
   * - Already-deleted devices return NotFoundException
   */
  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_not_found'),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
