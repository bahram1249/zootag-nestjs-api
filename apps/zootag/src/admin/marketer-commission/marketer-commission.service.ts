import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import {
  ZTMarketerCommission,
  ZTCommissionType,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { MarketerCommissionDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class MarketerCommissionService {
  constructor(
    @InjectModel(ZTMarketerCommission)
    private readonly repository: typeof ZTMarketerCommission,
    private readonly localizationService: LocalizationService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(marketerId: number) {
    let qb = new QueryOptionsBuilder().filter({ marketerId });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'marketerId',
        'commissionTypeId',
        'commissionValue',
        'startDate',
        'endDate',
        'priority',
        'isActive',
      ])
      .include([
        {
          model: ZTCommissionType,
          as: 'commissionType',
          attributes: ['id', 'name'],
          required: false,
        },
      ])
      .order({ orderBy: 'priority', sortOrder: 'ASC' });
    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  async findById(marketerId: number, id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter({ marketerId })
        .attributes([
          'id',
          'marketerId',
          'commissionTypeId',
          'commissionValue',
          'startDate',
          'endDate',
          'priority',
          'isActive',
        ])
        .include([
          {
            model: ZTCommissionType,
            as: 'commissionType',
            attributes: ['id', 'name'],
            required: false,
          },
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.marketer_commission_not_found'),
      );
    return { result: item };
  }

  async create(marketerId: number, dto: MarketerCommissionDto, user: User) {
    const mapped = this.mapper.map(dto, MarketerCommissionDto, ZTMarketerCommission).toJSON();
    const item = await this.repository.create({
      ...mapped,
      marketerId: BigInt(marketerId),
      priority: dto.priority ?? 0,
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  async update(marketerId: number, id: number, dto: MarketerCommissionDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ marketerId }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.marketer_commission_not_found'),
      );
    const mapped = this.mapper.map(dto, MarketerCommissionDto, ZTMarketerCommission).toJSON();
    await item.update({
      ...mapped,
      priority: dto.priority ?? 0,
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  async deleteById(marketerId: number, id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ marketerId }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.marketer_commission_not_found'),
      );
    await item.destroy();
    return { result: item };
  }
}
