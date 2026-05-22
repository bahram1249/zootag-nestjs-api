import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTManufacturer } from '@rahino/localdatabase/models';
import { ManufacturerFilterDto, ManufacturerDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectModel(ZTManufacturer)
    private readonly repository: typeof ZTManufacturer,
    private readonly localizationService: LocalizationService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: ManufacturerFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [
          { manufacturerName: { [Op.like]: filter.search } },
        ],
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes(['id', 'manufacturerName', 'description', 'isActive'])
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
        .attributes(['id', 'manufacturerName', 'description', 'isActive'])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.manufacturer_not_found'),
      );
    return { result: item };
  }

  async create(dto: ManufacturerDto) {
    const item = await this.repository.create(
      this.mapper.map(dto, ManufacturerDto, ZTManufacturer).toJSON(),
    );
    return { result: item };
  }

  async update(id: number, dto: ManufacturerDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.manufacturer_not_found'),
      );
    await item.update(
      this.mapper.map(dto, ManufacturerDto, ZTManufacturer).toJSON(),
    );
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.manufacturer_not_found'),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
