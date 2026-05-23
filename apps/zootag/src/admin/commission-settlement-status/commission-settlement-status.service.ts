import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ZTCommissionSettlementStatus } from '@rahino/localdatabase/models';
import { CommissionSettlementStatusFilterDto } from './dto';
import { LocalizationMapperService } from '@rahino/zootag/shared/localization-mapper';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class CommissionSettlementStatusService {
  constructor(
    @InjectModel(ZTCommissionSettlementStatus)
    private readonly repository: typeof ZTCommissionSettlementStatus,
    private readonly localizationMapperService: LocalizationMapperService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: CommissionSettlementStatusFilterDto) {
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
      'commissionSettlementStatus',
    );
    return { result, total };
  }
}
