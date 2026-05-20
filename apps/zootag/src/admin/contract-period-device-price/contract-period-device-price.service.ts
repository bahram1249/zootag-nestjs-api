import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ZTContractPeriodDevicePrice } from '@rahino/localdatabase/models';
import {
  ContractPeriodDevicePriceFilterDto,
  ContractPeriodDevicePriceDto,
} from './dto';

@Injectable()
export class ContractPeriodDevicePriceService {
  constructor(
    @InjectModel(ZTContractPeriodDevicePrice)
    private readonly repository: typeof ZTContractPeriodDevicePrice,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: ContractPeriodDevicePriceFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [
          { contractPeriodId: { [Op.like]: filter.search } },
          { deviceTypeId: { [Op.like]: filter.search } },
        ],
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'contractPeriodId',
        'deviceTypeId',
        'purchasePrice',
        'currencyId',
        'purchasePriceIRR',
        'minimumQuantity',
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
        this.localizationService.translate(
          'zootag.contract_period_device_price_not_found',
        ),
      );
    return { result: item };
  }

  async create(dto: ContractPeriodDevicePriceDto) {
    const item = await this.repository.create({
      contractPeriodId: dto.contractPeriodId,
      deviceTypeId: dto.deviceTypeId,
      purchasePrice: dto.purchasePrice,
      currencyId: dto.currencyId,
      purchasePriceIRR: dto.purchasePriceIRR,
      minimumQuantity: dto.minimumQuantity,
    });
    return { result: item };
  }

  async update(id: number, dto: ContractPeriodDevicePriceDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.contract_period_device_price_not_found',
        ),
      );
    await item.update({
      contractPeriodId: dto.contractPeriodId,
      deviceTypeId: dto.deviceTypeId,
      purchasePrice: dto.purchasePrice,
      currencyId: dto.currencyId,
      purchasePriceIRR: dto.purchasePriceIRR,
      minimumQuantity: dto.minimumQuantity,
    });
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.contract_period_device_price_not_found',
        ),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
