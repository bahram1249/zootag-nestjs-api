import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTDevice } from '@rahino/localdatabase/models';
import { DeviceFilterDto, DeviceDto } from './dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(ZTDevice)
    private readonly repository: typeof ZTDevice,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
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
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_not_found'),
      );
    return { result: item };
  }

  async create(dto: DeviceDto) {
    const item = await this.repository.create({
      serialNumber: dto.serialNumber,
      imei: dto.imei,
      macAddress: dto.macAddress,
      companyId: dto.companyId,
      deviceTypeId: dto.deviceTypeId,
      contractPeriodId: dto.contractPeriodId,
      purchasePrice: dto.purchasePrice,
      currencyId: dto.currencyId,
      purchasePriceIRR: dto.purchasePriceIRR,
      purchaseDate: dto.purchaseDate,
      warrantyEndDate: dto.warrantyEndDate,
      deviceStatusId: dto.deviceStatusId,
    });
    return { result: item };
  }

  async update(id: number, dto: DeviceDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_not_found'),
      );
    await item.update({
      serialNumber: dto.serialNumber,
      imei: dto.imei,
      macAddress: dto.macAddress,
      companyId: dto.companyId,
      deviceTypeId: dto.deviceTypeId,
      contractPeriodId: dto.contractPeriodId,
      purchasePrice: dto.purchasePrice,
      currencyId: dto.currencyId,
      purchasePriceIRR: dto.purchasePriceIRR,
      purchaseDate: dto.purchaseDate,
      warrantyEndDate: dto.warrantyEndDate,
      deviceStatusId: dto.deviceStatusId,
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
