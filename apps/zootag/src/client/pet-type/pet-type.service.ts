import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ZTPetType } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter/types';

@Injectable()
export class PetTypeService {
  constructor(
    @InjectModel(ZTPetType)
    private readonly repository: typeof ZTPetType,
  ) {}

  async findAll(filter: ListFilter) {
    let qb = new QueryOptionsBuilder().filter({
      isActive: true,
    }).filterIf(
      !!filter.search && filter.search !== '%%',
      { name: { [Op.like]: filter.search } },
    );
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes(['id', 'name'])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }
}
