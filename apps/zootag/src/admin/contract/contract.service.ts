import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { LocalizationMapperService } from '@rahino/zootag/shared/localization-mapper';
import {
  ZTContract,
  ZTCompany,
  ZTContractStatus,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { ContractFilterDto, ContractDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(ZTContract)
    private readonly repository: typeof ZTContract,
    private readonly localizationService: LocalizationService,
    private readonly localizationMapperService: LocalizationMapperService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Business rules:
   * - Only returns non-deleted contracts (isDeleted = 0)
   * - Search matches title or contractNumber
   * - contractStatus names are localized via i18n
   */
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
        'contractStatusId',
        'notes',
        'isActive',
      ])
      .include([
        {
          model: ZTCompany,
          as: 'company',
          attributes: ['id', 'companyName'],
          required: false,
        },
        {
          model: ZTContractStatus,
          as: 'contractStatus',
          attributes: ['id', 'name'],
          required: false,
        },
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
    const result = this.localizationMapperService.localizeItems(
      (await this.repository.findAll(qb.build())).map((r) => r.toJSON()),
      { contractStatus: 'contractStatus' },
    );
    return { result, total };
  }

  /**
   * Business rules:
   * - Only returns non-deleted contracts
   * - contractStatus names are localized via i18n
   */
  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter({ isDeleted: 0 })
        .attributes([
          'id',
          'companyId',
          'contractNumber',
          'title',
          'startDate',
          'endDate',
          'contractStatusId',
          'notes',
          'isActive',
        ])
        .include([
          {
            model: ZTCompany,
            as: 'company',
            attributes: ['id', 'companyName'],
            required: false,
          },
          {
            model: ZTContractStatus,
            as: 'contractStatus',
            attributes: ['id', 'name'],
            required: false,
          },
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
        this.localizationService.translate('zootag.contract_not_found'),
      );
    return {
      result: this.localizationMapperService.localizeItem(item.toJSON(), {
        contractStatus: 'contractStatus',
      }),
    };
  }

  /**
   * Business rules:
   * - Sets audit fields (createdUserId, updatedUserId) from authenticated user
   */
  async create(dto: ContractDto, user: User) {
    const mapped = this.mapper.map(dto, ContractDto, ZTContract).toJSON();
    const item = await this.repository.create({
      ...mapped,
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  /**
   * Business rules:
   * - Only non-deleted contracts can be updated
   * - Sets updatedUserId from authenticated user
   */
  async update(id: number, dto: ContractDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.contract_not_found'),
      );
    const mapped = this.mapper.map(dto, ContractDto, ZTContract).toJSON();
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
        this.localizationService.translate('zootag.contract_not_found'),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
