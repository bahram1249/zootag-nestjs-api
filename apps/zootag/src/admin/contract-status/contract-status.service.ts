import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTContractStatus } from '@rahino/localdatabase/models';
import { ContractStatusFilterDto, ContractStatusDto } from './dto';

@Injectable()
export class ContractStatusService {
  constructor(
    @InjectModel(ZTContractStatus)
    private readonly repository: typeof ZTContractStatus,
    private readonly localizationService: LocalizationService,
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
    const result = await this.repository.findAll(qb.build());
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
    return { result: item };
  }

  async create(dto: ContractStatusDto) {
    const item = await this.repository.create({
      id: dto.id,
      name: dto.name,
    });
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
    await item.update({ name: dto.name });
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
