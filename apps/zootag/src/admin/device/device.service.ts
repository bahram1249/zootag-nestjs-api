import { Injectable, NotFoundException } from '@nestjs/common';
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
        'purchasePrice',
        'currencyId',
        'purchasePriceIRR',
        'purchaseDate',
        'warrantyEndDate',
        'deviceStatusId',
        'isActive',
      ])
      .include([
        { model: ZTCompany, as: 'company', attributes: ['id', 'companyName'], required: false },
        { model: ZTDeviceType, as: 'deviceType', attributes: ['id', 'typeName', 'modelCode'], required: false },
        { model: ZTContractPeriod, as: 'contractPeriod', attributes: ['id', 'periodName'], required: false },
        { model: ZTCurrency, as: 'currency', attributes: ['id', 'code', 'name', 'symbol'], required: false },
        { model: ZTDeviceStatus, as: 'deviceStatus', attributes: ['id', 'name'], required: false },
        { model: User, as: 'createdUser', attributes: ['id', 'firstname', 'lastname'], required: false },
        { model: User, as: 'updatedUser', attributes: ['id', 'firstname', 'lastname'], required: false },
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
        .include([
          { model: ZTCompany, as: 'company', attributes: ['id', 'companyName'], required: false },
          { model: ZTDeviceType, as: 'deviceType', attributes: ['id', 'typeName', 'modelCode'], required: false },
          { model: ZTContractPeriod, as: 'contractPeriod', attributes: ['id', 'periodName'], required: false },
          { model: ZTCurrency, as: 'currency', attributes: ['id', 'code', 'name', 'symbol'], required: false },
          { model: ZTDeviceStatus, as: 'deviceStatus', attributes: ['id', 'name'], required: false },
          { model: User, as: 'createdUser', attributes: ['id', 'firstname', 'lastname'], required: false },
          { model: User, as: 'updatedUser', attributes: ['id', 'firstname', 'lastname'], required: false },
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_not_found'),
      );
    return {
      result: this.localizationMapperService.localizeItem(
        item.toJSON(),
        { deviceStatus: 'deviceStatus' },
      ),
    };
  }

  async create(dto: DeviceDto, user: User) {
    let purchasePriceIRR = dto.purchasePriceIRR;
    if (dto.purchasePrice != null && dto.currencyId != null && purchasePriceIRR == null) {
      purchasePriceIRR = await this.currencyCalculationService.convertToIRR(
        dto.purchasePrice,
        BigInt(dto.currencyId),
      );
    }
    const mapped = this.mapper.map(dto, DeviceDto, ZTDevice).toJSON();
    const item = await this.repository.create({
      ...mapped,
      purchasePriceIRR: purchasePriceIRR ?? 0,
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
