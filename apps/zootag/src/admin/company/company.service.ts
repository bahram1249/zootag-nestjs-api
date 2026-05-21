import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTCompany } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { CompanyFilterDto, CompanyDto } from './dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(ZTCompany)
    private readonly repository: typeof ZTCompany,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: CompanyFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [
          { companyName: { [Op.like]: filter.search } },
          { legalName: { [Op.like]: filter.search } },
        ],
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'companyName',
        'legalName',
        'taxNumber',
        'email',
        'phone',
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
        this.localizationService.translate('zootag.company_not_found'),
      );
    return { result: item };
  }

  async create(dto: CompanyDto, user: User) {
    const item = await this.repository.create({
      companyName: dto.companyName,
      legalName: dto.legalName,
      taxNumber: dto.taxNumber,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  async update(id: number, dto: CompanyDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.company_not_found'),
      );
    await item.update({
      companyName: dto.companyName,
      legalName: dto.legalName,
      taxNumber: dto.taxNumber,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
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
        this.localizationService.translate('zootag.company_not_found'),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
