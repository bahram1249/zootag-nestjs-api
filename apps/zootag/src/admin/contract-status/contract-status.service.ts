import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTContractStatus } from '@rahino/localdatabase/models';
import { ContractStatusFilterDto, ContractStatusDto } from './dto';
import { LocalizationMapperService } from '@rahino/zootag/shared/localization-mapper';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class ContractStatusService {
  constructor(
    @InjectModel(ZTContractStatus)
    private readonly repository: typeof ZTContractStatus,
    private readonly localizationService: LocalizationService,
    private readonly localizationMapperService: LocalizationMapperService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: ContractStatusFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search },
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes(['id', 'name', 'isActive'])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = this.localizationMapperService.localizeLookupItems(
      (await this.repository.findAll(qb.build())).map((r) => r.toJSON()),
      'contractStatus',
    );
    return { result, total };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.contract_status_not_found'),
      );
    return {
      result: this.localizationMapperService.localizeLookupItem(
        item.toJSON(),
        'contractStatus',
      ),
    };
  }

  async create(dto: ContractStatusDto) {
    const item = await this.repository.create(
      this.mapper.map(dto, ContractStatusDto, ZTContractStatus).toJSON(),
    );
    return { result: item };
  }

  async update(id: number, dto: ContractStatusDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.contract_status_not_found'),
      );
    await item.update(
      this.mapper.map(dto, ContractStatusDto, ZTContractStatus).toJSON(),
    );
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.contract_status_not_found'),
      );
    await item.destroy();
    return { result: item };
  }
}
