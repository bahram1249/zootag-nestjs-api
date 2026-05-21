import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTCompany } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { CompanyFilterDto, CompanyDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(ZTCompany)
    private readonly repository: typeof ZTCompany,
    private readonly localizationService: LocalizationService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Business rules:
   * - Only returns non-deleted companies (isDeleted = 0)
   * - Search matches companyName or legalName
   */
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
      .include([
        {
          model: User,
          as: 'createdUser',
          attributes: ['id', 'firstname', 'lastname'],
          required: false,
        },
        {
          model: User,
          as: 'updatedUser',
          attributes: ['id', 'firstname', 'lastname'],
          required: false,
        },
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  /**
   * Business rules:
   * - Only returns non-deleted companies
   */
  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter({ isDeleted: 0 })
        .attributes([
          'id',
          'companyName',
          'legalName',
          'taxNumber',
          'email',
          'phone',
          'isActive',
        ])
        .include([
          {
            model: User,
            as: 'createdUser',
            attributes: ['id', 'firstname', 'lastname'],
            required: false,
          },
          {
            model: User,
            as: 'updatedUser',
            attributes: ['id', 'firstname', 'lastname'],
            required: false,
          },
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.company_not_found'),
      );
    return { result: item };
  }

  /**
   * Business rules:
   * - Sets audit fields (createdUserId, updatedUserId) from authenticated user
   */
  async create(dto: CompanyDto, user: User) {
    const mapped = this.mapper.map(dto, CompanyDto, ZTCompany).toJSON();
    const item = await this.repository.create({
      ...mapped,
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  /**
   * Business rules:
   * - Only non-deleted companies can be updated
   * - Sets updatedUserId from authenticated user
   */
  async update(id: number, dto: CompanyDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.company_not_found'),
      );
    const mapped = this.mapper.map(dto, CompanyDto, ZTCompany).toJSON();
    await item.update({
      ...mapped,
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  /**
   * Business rules:
   * - Soft delete: sets isDeleted = true instead of hard-deleting
   */
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
