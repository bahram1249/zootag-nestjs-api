import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { LocalizationMapperService } from '@rahino/zootag/shared/localization-mapper';
import { ZTContractPeriod, ZTContract, ZTContractPeriodStatus } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { ContractPeriodFilterDto, ContractPeriodDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class ContractPeriodService {
  constructor(
    @InjectModel(ZTContractPeriod)
    private readonly repository: typeof ZTContractPeriod,
    private readonly localizationService: LocalizationService,
    private readonly localizationMapperService: LocalizationMapperService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: ContractPeriodFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.search && filter.search !== '%%', {
        periodName: { [Op.like]: filter.search },
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'contractId',
        'periodName',
        'startDate',
        'endDate',
        'contractPeriodStatusId',
        'notes',
        'isActive',
      ])
      .include([
        { model: ZTContract, as: 'contract', attributes: ['id', 'contractNumber', 'title'], required: false },
        { model: ZTContractPeriodStatus, as: 'contractPeriodStatus', attributes: ['id', 'name'], required: false },
        { model: User, as: 'createdUser', attributes: ['id', 'firstname', 'lastname'], required: false },
        { model: User, as: 'updatedUser', attributes: ['id', 'firstname', 'lastname'], required: false },
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = this.localizationMapperService.localizeItems(
      (await this.repository.findAll(qb.build())).map((r) => r.toJSON()),
      { contractPeriodStatus: 'contractPeriodStatus' },
    );
    return { result, total };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter({ isDeleted: 0 })
        .include([
          { model: ZTContract, as: 'contract', attributes: ['id', 'contractNumber', 'title'], required: false },
          { model: ZTContractPeriodStatus, as: 'contractPeriodStatus', attributes: ['id', 'name'], required: false },
          { model: User, as: 'createdUser', attributes: ['id', 'firstname', 'lastname'], required: false },
          { model: User, as: 'updatedUser', attributes: ['id', 'firstname', 'lastname'], required: false },
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.contract_period_not_found'),
      );
    return {
      result: this.localizationMapperService.localizeItem(
        item.toJSON(),
        { contractPeriodStatus: 'contractPeriodStatus' },
      ),
    };
  }

  async create(dto: ContractPeriodDto, user: User) {
    const mapped = this.mapper.map(dto, ContractPeriodDto, ZTContractPeriod).toJSON();
    const item = await this.repository.create({
      ...mapped,
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  async update(id: number, dto: ContractPeriodDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.contract_period_not_found'),
      );
    const mapped = this.mapper.map(dto, ContractPeriodDto, ZTContractPeriod).toJSON();
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
        this.localizationService.translate('zootag.contract_period_not_found'),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
