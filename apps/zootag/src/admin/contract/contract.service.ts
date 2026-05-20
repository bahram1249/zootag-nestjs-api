import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTContract } from '@rahino/localdatabase/models';
import { ContractFilterDto, ContractDto } from './dto';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(ZTContract)
    private readonly repository: typeof ZTContract,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: ContractFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [
          { title: { [Op.like]: filter.search } },
          { contractNumber: { [Op.like]: filter.search } },
        ],
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'companyId',
        'contractNumber',
        'title',
        'startDate',
        'endDate',
        'currencyId',
        'contractStatusId',
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
        this.localizationService.translate('zootag.contract_not_found'),
      );
    return { result: item };
  }

  async create(dto: ContractDto) {
    const item = await this.repository.create({
      companyId: dto.companyId,
      contractNumber: dto.contractNumber,
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate,
      currencyId: dto.currencyId,
      contractStatusId: dto.contractStatusId,
      notes: dto.notes,
    });
    return { result: item };
  }

  async update(id: number, dto: ContractDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.contract_not_found'),
      );
    await item.update({
      companyId: dto.companyId,
      contractNumber: dto.contractNumber,
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate,
      currencyId: dto.currencyId,
      contractStatusId: dto.contractStatusId,
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
        this.localizationService.translate('zootag.contract_not_found'),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
