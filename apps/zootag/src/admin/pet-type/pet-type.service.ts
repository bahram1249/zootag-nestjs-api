import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTPetType } from '@rahino/localdatabase/models';
import { PetTypeFilterDto, PetTypeDto } from './dto';
import { LocalizationMapperService } from '@rahino/zootag/shared/localization-mapper';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';

@Injectable()
export class PetTypeService {
  constructor(
    @InjectModel(ZTPetType)
    private readonly repository: typeof ZTPetType,
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
  async findAll(filter: PetTypeFilterDto) {
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
      'PetType',
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
        this.localizationService.translate('zootag.not_found'),
      );
    return {
      result: this.localizationMapperService.localizeLookupItem(
        item.toJSON(),
        'PetType',
      ),
    };
  }

  async create(dto: PetTypeDto) {
    const found = await this.repository.findByPk(dto.id);
    if (found)
      throw new BadRequestException(
        this.localizationService.translate('core.duplicate_request'),
      );

    const item = await this.repository.create(
      JSON.parse(JSON.stringify(_.pick(dto, ['id', 'name']))),
    );
    return { result: item };
  }

  async update(id: number, dto: PetTypeDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.not_found'),
      );
    await item.update(this.mapper.map(dto, PetTypeDto, ZTPetType).toJSON());
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
        this.localizationService.translate('zootag.not_found'),
      );
    await item.destroy();
    return { result: item };
  }
}
