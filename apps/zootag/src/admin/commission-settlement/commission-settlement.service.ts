import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import {
  ZTCommissionSettlement,
  ZTMarketer,
  ZTDeviceSale,
  ZTCommissionSettlementStatus,
} from '@rahino/localdatabase/models';
import { CommissionSettlementFilterDto, CommissionSettlementDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { CommissionSettlementStatus } from '@rahino/zootag/shared/enums';

@Injectable()
export class CommissionSettlementService {
  constructor(
    @InjectModel(ZTCommissionSettlement)
    private readonly repository: typeof ZTCommissionSettlement,
    private readonly localizationService: LocalizationService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: CommissionSettlementFilterDto) {
    let qb = new QueryOptionsBuilder().filterIf(
      !!filter.search && filter.search !== '%%',
      {
        [Op.or]: [],
      },
    );
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'marketerId',
        'deviceSaleId',
        'amountIRR',
        'paymentDate',
        'statusId',
        'notes',
      ])
      .include([
        {
          model: ZTMarketer,
          as: 'marketer',
          attributes: ['id', 'fullName'],
          required: false,
        },
        {
          model: ZTDeviceSale,
          as: 'deviceSale',
          attributes: ['id', 'salePrice', 'salePriceIRR'],
          required: false,
        },
        {
          model: ZTCommissionSettlementStatus,
          as: 'status',
          attributes: ['id', 'name'],
          required: false,
        },
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .attributes([
          'id',
          'marketerId',
          'deviceSaleId',
          'amountIRR',
          'paymentDate',
          'statusId',
          'notes',
        ])
        .include([
          {
            model: ZTMarketer,
            as: 'marketer',
            attributes: ['id', 'fullName'],
            required: false,
          },
          {
            model: ZTDeviceSale,
            as: 'deviceSale',
            attributes: ['id', 'salePrice', 'salePriceIRR'],
            required: false,
          },
          {
            model: ZTCommissionSettlementStatus,
            as: 'status',
            attributes: ['id', 'name'],
            required: false,
          },
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.commission_settlement_not_found',
        ),
      );
    return { result: item };
  }

  async create(dto: CommissionSettlementDto) {
    const mapped = this.mapper
      .map(dto, CommissionSettlementDto, ZTCommissionSettlement)
      .toJSON();
    const item = await this.repository.create({
      ...mapped,
      statusId: BigInt(dto.statusId || CommissionSettlementStatus.Pending),
    });
    return { result: item };
  }

  async update(id: number, dto: CommissionSettlementDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.commission_settlement_not_found',
        ),
      );
    const mapped = this.mapper
      .map(dto, CommissionSettlementDto, ZTCommissionSettlement)
      .toJSON();
    await item.update(mapped);
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.commission_settlement_not_found',
        ),
      );
    await item.destroy();
    return { result: item };
  }
}
