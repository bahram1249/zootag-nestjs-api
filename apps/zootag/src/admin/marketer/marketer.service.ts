import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { LocalizationMapperService } from '@rahino/zootag/shared/localization-mapper';
import { ZTMarketer, ZTCommissionType } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { MarketerFilterDto, MarketerDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class MarketerService {
  constructor(
    @InjectModel(ZTMarketer)
    private readonly repository: typeof ZTMarketer,
    private readonly localizationService: LocalizationService,
    private readonly localizationMapperService: LocalizationMapperService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: MarketerFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [
          { fullName: { [Op.like]: filter.search } },
          { mobile: { [Op.like]: filter.search } },
        ],
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'fullName',
        'mobile',
        'email',
        'nationalCode',
        'defaultCommissionTypeId',
        'defaultCommissionValue',
        'isActive',
      ])
      .include([
        {
          model: ZTCommissionType,
          as: 'defaultCommissionType',
          attributes: ['id', 'name'],
          required: false,
        },
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = this.localizationMapperService.localizeItems(
      (await this.repository.findAll(qb.build())).map((r) => r.toJSON()),
      { defaultCommissionType: 'commissionType' },
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
          'fullName',
          'mobile',
          'email',
          'nationalCode',
          'defaultCommissionTypeId',
          'defaultCommissionValue',
          'isActive',
        ])
        .include([
          {
            model: ZTCommissionType,
            as: 'defaultCommissionType',
            attributes: ['id', 'name'],
            required: false,
          },
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.marketer_not_found'),
      );
    return {
      result: this.localizationMapperService.localizeItem(item.toJSON(), {
        defaultCommissionType: 'commissionType',
      }),
    };
  }

  async create(dto: MarketerDto, user: User) {
    const mapped = this.mapper.map(dto, MarketerDto, ZTMarketer).toJSON();
    const item = await this.repository.create({
      ...mapped,
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  async update(id: number, dto: MarketerDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.marketer_not_found'),
      );
    const mapped = this.mapper.map(dto, MarketerDto, ZTMarketer).toJSON();
    await item.update({
      ...mapped,
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
        this.localizationService.translate('zootag.marketer_not_found'),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
