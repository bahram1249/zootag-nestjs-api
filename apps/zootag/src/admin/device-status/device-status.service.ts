import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTDeviceStatus } from '@rahino/localdatabase/models';
import { DeviceStatusFilterDto, DeviceStatusDto } from './dto';
import { LocalizationMapperService } from '@rahino/zootag/shared/localization-mapper';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class DeviceStatusService {
  constructor(
    @InjectModel(ZTDeviceStatus)
    private readonly repository: typeof ZTDeviceStatus,
    private readonly localizationService: LocalizationService,
    private readonly localizationMapperService: LocalizationMapperService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Business rules:
   * - No soft delete filter — all statuses are returned
   * - Names are localized via i18n lookup
   */
  async findAll(filter: DeviceStatusFilterDto) {
    let qb = new QueryOptionsBuilder().filterIf(
      !!filter.search && filter.search !== '%%',
      {
        name: { [Op.like]: filter.search },
      },
    );
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes(['id', 'name', 'isActive'])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = this.localizationMapperService.localizeLookupItems(
      (await this.repository.findAll(qb.build())).map((r) => r.toJSON()),
      'deviceStatus',
    );
    return { result, total };
  }

  /**
   * Business rules:
   * - Names are localized via i18n lookup
   */
  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .attributes(['id', 'name', 'isActive'])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_status_not_found'),
      );
    return {
      result: this.localizationMapperService.localizeLookupItem(
        item.toJSON(),
        'deviceStatus',
      ),
    };
  }

  async create(dto: DeviceStatusDto) {
    const item = await this.repository.create(
      this.mapper.map(dto, DeviceStatusDto, ZTDeviceStatus).toJSON(),
    );
    return { result: item };
  }

  async update(id: number, dto: DeviceStatusDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_status_not_found'),
      );
    await item.update(
      this.mapper.map(dto, DeviceStatusDto, ZTDeviceStatus).toJSON(),
    );
    return { result: item };
  }

  /**
   * Business rules:
   * - Hard delete: permanently removes the row (no isDeleted column)
   */
  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_status_not_found'),
      );
    await item.destroy();
    return { result: item };
  }
}
