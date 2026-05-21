import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTDeviceType } from '@rahino/localdatabase/models';
import { DeviceTypeFilterDto, DeviceTypeDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class DeviceTypeService {
  constructor(
    @InjectModel(ZTDeviceType)
    private readonly repository: typeof ZTDeviceType,
    private readonly localizationService: LocalizationService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: DeviceTypeFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [
          { typeName: { [Op.like]: filter.search } },
          { modelCode: { [Op.like]: filter.search } },
        ],
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes(['id', 'typeName', 'modelCode', 'description', 'isActive'])
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
        this.localizationService.translate('zootag.device_type_not_found'),
      );
    return { result: item };
  }

  async create(dto: DeviceTypeDto) {
    const item = await this.repository.create(
      this.mapper.map(dto, DeviceTypeDto, ZTDeviceType).toJSON(),
    );
    return { result: item };
  }

  async update(id: number, dto: DeviceTypeDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_type_not_found'),
      );
    await item.update(
      this.mapper.map(dto, DeviceTypeDto, ZTDeviceType).toJSON(),
    );
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_type_not_found'),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
