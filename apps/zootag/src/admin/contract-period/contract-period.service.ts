import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTContractPeriod } from '@rahino/localdatabase/models';
import { ContractPeriodFilterDto, ContractPeriodDto } from './dto';

@Injectable()
export class ContractPeriodService {
  constructor(
    @InjectModel(ZTContractPeriod)
    private readonly repository: typeof ZTContractPeriod,
    private readonly localizationService: LocalizationService,
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
        this.localizationService.translate('zootag.contract_period_not_found'),
      );
    return { result: item };
  }

  async create(dto: ContractPeriodDto) {
    const item = await this.repository.create({
      contractId: dto.contractId,
      periodName: dto.periodName,
      startDate: dto.startDate,
      endDate: dto.endDate,
      contractPeriodStatusId: dto.contractPeriodStatusId,
      notes: dto.notes,
    });
    return { result: item };
  }

  async update(id: number, dto: ContractPeriodDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.contract_period_not_found'),
      );
    await item.update({
      contractId: dto.contractId,
      periodName: dto.periodName,
      startDate: dto.startDate,
      endDate: dto.endDate,
      contractPeriodStatusId: dto.contractPeriodStatusId,
      notes: dto.notes,
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
