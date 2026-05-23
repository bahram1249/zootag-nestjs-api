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
  ZTContract,
  ZTContractPeriod,
  ZTContractPeriodDevicePrice,
  ZTCurrency,
  ZTDeviceStatus,
  ZTDeviceSale,
  ZTInventoryStatus,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { CurrencyCalculationService } from '@rahino/zootag/shared/currency-calculation';
import { InventoryStatus } from '@rahino/zootag/shared/enums';
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
        'inventoryStatusId',
        'saleId',
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
          model: ZTDeviceStatus,
          as: 'deviceStatus',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: ZTInventoryStatus,
          as: 'inventoryStatus',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: ZTDeviceSale,
          as: 'sale',
          attributes: ['id', 'salePrice'],
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

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter({ isDeleted: 0 })
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
          'inventoryStatusId',
          'saleId',
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
            model: ZTDeviceStatus,
            as: 'deviceStatus',
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: ZTInventoryStatus,
            as: 'inventoryStatus',
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: ZTDeviceSale,
            as: 'sale',
            attributes: ['id', 'salePrice'],
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

  async create(dto: DeviceDto, user: User) {
    const priceRecord = await this.contractPeriodDevicePriceRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.contractPeriodDevicePriceId })
        .filter({ isDeleted: 0 })
        .include([
          {
            model: ZTContractPeriod,
            as: 'contractPeriod',
            required: true,
            include: [
              {
                model: ZTContract,
                as: 'contract',
                required: true,
                include: [
                  {
                    model: ZTCompany,
                    as: 'company',
                    required: true,
                    attributes: ['id'],
                  },
                ],
              },
            ],
          },
        ])
        .build(),
    );
    if (!priceRecord)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.contract_period_device_price_not_found',
        ),
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
      companyId: BigInt(priceRecord.contractPeriod.contract.companyId),
      deviceTypeId: BigInt(priceRecord.deviceTypeId),
      contractPeriodId: priceRecord.contractPeriodId,
      purchasePrice: priceRecord.purchasePrice,
      currencyId: priceRecord.currencyId,
      purchasePriceIRR: priceRecord.purchasePriceIRR,
      inventoryStatusId: BigInt(InventoryStatus.Available),
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

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
      companyId: item.companyId,
      contractPeriodDevicePriceId: item.contractPeriodDevicePriceId,
      contractPeriodId: item.contractPeriodId,
      deviceTypeId: item.deviceTypeId,
      purchasePrice: item.purchasePrice,
      currencyId: item.currencyId,
      purchasePriceIRR: item.purchasePriceIRR,
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

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
