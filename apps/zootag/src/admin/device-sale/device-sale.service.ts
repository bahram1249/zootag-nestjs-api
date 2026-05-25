import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import {
  ZTDeviceSale,
  ZTDevice,
  ZTMarketer,
  ZTMarketerCommission,
  ZTDeviceSalePrice,
  ZTCompany,
  ZTCurrency,
  ZTCommissionType,
  ZTInventoryStatus,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { CurrencyCalculationService } from '@rahino/zootag/shared/currency-calculation';
import { CommissionType, InventoryStatus } from '@rahino/zootag/shared/enums';
import {
  DeviceSaleFilterDto,
  DeviceSaleDto,
  DeviceSalePreviewQueryDto,
} from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class DeviceSaleService {
  constructor(
    @InjectModel(ZTDeviceSale)
    private readonly repository: typeof ZTDeviceSale,
    @InjectModel(ZTDevice)
    private readonly deviceRepository: typeof ZTDevice,
    @InjectModel(ZTMarketer)
    private readonly marketerRepository: typeof ZTMarketer,
    @InjectModel(ZTMarketerCommission)
    private readonly marketerCommissionRepository: typeof ZTMarketerCommission,
    @InjectModel(ZTDeviceSalePrice)
    private readonly deviceSalePriceRepository: typeof ZTDeviceSalePrice,
    @InjectModel(ZTCommissionType)
    private readonly commissionTypeRepository: typeof ZTCommissionType,
    @InjectModel(ZTInventoryStatus)
    private readonly inventoryStatusRepository: typeof ZTInventoryStatus,
    private readonly localizationService: LocalizationService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly currencyCalculationService: CurrencyCalculationService,
  ) {}

  async findAll(filter: DeviceSaleFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filterIf(!!filter.search && filter.search !== '%%', {
        [Op.or]: [],
      })
      .filterIf(!!filter.startDate, {
        saleDate: { [Op.gte]: new Date(filter.startDate) },
      })
      .filterIf(!!filter.endDate, {
        saleDate: { [Op.lte]: new Date(filter.endDate) },
      })
      .filterIf(!!filter.marketerId, {
        marketerId: filter.marketerId,
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'deviceId',
        'marketerId',
        'customerCompanyId',
        'saleDate',
        'salePrice',
        'saleCurrencyId',
        'salePriceIRR',
        'purchasePriceIRR',
        'grossProfitIRR',
        'commissionTypeId',
        'commissionValue',
        'commissionAmountIRR',
        'netProfitIRR',
        'notes',
        'deviceSalePriceId',
      ])
      .include([
        {
          model: ZTDevice,
          as: 'device',
          attributes: ['id', 'serialNumber', 'imei'],
          required: false,
        },
        {
          model: ZTMarketer,
          as: 'marketer',
          attributes: ['id', 'fullName'],
          required: false,
        },
        {
          model: ZTCompany,
          as: 'customerCompany',
          attributes: ['id', 'companyName'],
          required: false,
        },
        {
          model: ZTCurrency,
          as: 'saleCurrency',
          attributes: ['id', 'code', 'name', 'symbol'],
          required: false,
        },
        {
          model: ZTCommissionType,
          as: 'commissionType',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: User,
          as: 'createdUser',
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

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .attributes([
          'id',
          'deviceId',
          'marketerId',
          'customerCompanyId',
          'saleDate',
          'salePrice',
          'saleCurrencyId',
          'salePriceIRR',
          'purchasePriceIRR',
          'grossProfitIRR',
          'commissionTypeId',
          'commissionValue',
          'commissionAmountIRR',
          'netProfitIRR',
          'notes',
          'deviceSalePriceId',
        ])
        .include([
          {
            model: ZTDevice,
            as: 'device',
            attributes: ['id', 'serialNumber', 'imei'],
            required: false,
          },
          {
            model: ZTMarketer,
            as: 'marketer',
            attributes: ['id', 'fullName'],
            required: false,
          },
          {
            model: ZTCompany,
            as: 'customerCompany',
            attributes: ['id', 'companyName'],
            required: false,
          },
          {
            model: ZTCurrency,
            as: 'saleCurrency',
            attributes: ['id', 'code', 'name', 'symbol'],
            required: false,
          },
          {
            model: ZTCommissionType,
            as: 'commissionType',
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: User,
            as: 'createdUser',
            attributes: ['id', 'firstname', 'lastname'],
            required: false,
          },
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_sale_not_found'),
      );
    return { result: item };
  }

  async preview(dto: DeviceSalePreviewQueryDto) {
    const calc = await this.calculatePreview(dto);

    const commissionType = await this.commissionTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: calc.commissionTypeId })
        .attributes(['id', 'name'])
        .build(),
    );

    return {
      result: {
        salePrice: calc.salePrice,
        saleCurrencyId: calc.saleCurrencyId,
        salePriceIRR: calc.salePriceIRR,
        purchasePriceIRR: calc.purchasePriceIRR,
        grossProfitIRR: calc.grossProfitIRR,
        commissionTypeId: calc.commissionTypeId,
        commissionType: commissionType
          ? { id: commissionType.id, name: commissionType.name }
          : undefined,
        commissionValue: calc.commissionValue,
        commissionAmountIRR: calc.commissionAmountIRR,
        netProfitIRR: calc.netProfitIRR,
      },
    };
  }

  private async calculatePreview(dto: {
    deviceId: number;
    deviceSalePriceId: number;
    marketerId: number;
    saleDate: string;
  }) {
    const device = await this.deviceRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.deviceId })
        .filter({ isDeleted: 0 })
        .build(),
    );
    if (!device)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_not_found'),
      );

    const marketer = await this.marketerRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.marketerId }).build(),
    );
    if (!marketer)
      throw new NotFoundException(
        this.localizationService.translate('zootag.marketer_not_found'),
      );

    const deviceSalePrice = await this.deviceSalePriceRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.deviceSalePriceId }).build(),
    );
    if (!deviceSalePrice)
      throw new NotFoundException(
        this.localizationService.translate(
          'zootag.device_sale_price_not_found',
        ),
      );
    if (Number(deviceSalePrice.deviceTypeId) !== Number(device.deviceTypeId))
      throw new BadRequestException(
        this.localizationService.translate('zootag.device_type_mismatch'),
      );

    const salePriceIRR = await this.currencyCalculationService.convertToIRR(
      Number(deviceSalePrice.salePrice),
      BigInt(deviceSalePrice.currencyId),
    );
    const purchasePriceIRR = Number(device.purchasePriceIRR);
    const grossProfitIRR = salePriceIRR - purchasePriceIRR;

    const matchedCommission = await this.marketerCommissionRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ marketerId: marketer.id })
        .filter({ isActive: true })
        .filter({
          startDate: { [Op.lte]: new Date(dto.saleDate) },
        })
        .filter({
          [Op.or]: [
            { endDate: null },
            { endDate: { [Op.gte]: new Date(dto.saleDate) } },
          ],
        })
        .order({ orderBy: 'priority', sortOrder: 'ASC' })
        .build(),
    );

    const commissionTypeId =
      Number(matchedCommission?.commissionTypeId) ||
      Number(marketer.defaultCommissionTypeId) ||
      CommissionType.Percent;
    const commissionValue =
      matchedCommission?.commissionValue != null
        ? Number(matchedCommission.commissionValue)
        : Number(marketer.defaultCommissionValue) || 0;

    let commissionAmountIRR: number;
    if (commissionTypeId === CommissionType.Percent) {
      commissionAmountIRR = (grossProfitIRR * commissionValue) / 100;
    } else {
      commissionAmountIRR = commissionValue;
    }

    const netProfitIRR = grossProfitIRR - commissionAmountIRR;

    return {
      salePrice: Number(deviceSalePrice.salePrice),
      saleCurrencyId: Number(deviceSalePrice.currencyId),
      salePriceIRR,
      purchasePriceIRR,
      grossProfitIRR,
      commissionTypeId,
      commissionValue,
      commissionAmountIRR,
      netProfitIRR,
    };
  }

  /**
   * Business rules:
   * - Validates device is available (not sold)
   * - Loads marketer default commission
   * - Calculates financial snapshots (gross profit, commission, net profit)
   * - Persists sale + updates device in a transaction
   * - All financial values are frozen at sale time
   */
  async create(dto: DeviceSaleDto, user: User) {
    const device = await this.deviceRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.deviceId })
        .filter({ isDeleted: 0 })
        .build(),
    );
    if (!device)
      throw new NotFoundException(
        this.localizationService.translate('zootag.device_not_found'),
      );
    if (Number(device.inventoryStatusId) === InventoryStatus.Sold)
      throw new BadRequestException(
        this.localizationService.translate('zootag.device_already_sold'),
      );

    const calc = await this.calculatePreview(dto);

    const transaction = await this.sequelize.transaction();
    try {
      const sale = await this.repository.create(
        {
          deviceId: BigInt(dto.deviceId),
          marketerId: BigInt(dto.marketerId),
          customerCompanyId: dto.customerCompanyId
            ? BigInt(dto.customerCompanyId)
            : null,
          saleDate: new Date(dto.saleDate),
          salePrice: calc.salePrice,
          saleCurrencyId: BigInt(calc.saleCurrencyId),
          salePriceIRR: calc.salePriceIRR,
          purchasePriceIRR: calc.purchasePriceIRR,
          grossProfitIRR: calc.grossProfitIRR,
          commissionTypeId: BigInt(calc.commissionTypeId),
          commissionValue: calc.commissionValue,
          commissionAmountIRR: calc.commissionAmountIRR,
          netProfitIRR: calc.netProfitIRR,
          notes: dto.notes || null,
          createdUserId: BigInt(user.id),
          deviceSalePriceId: BigInt(dto.deviceSalePriceId),
        },
        { transaction },
      );

      await device.update(
        {
          inventoryStatusId: BigInt(InventoryStatus.Sold),
          saleId: sale.id,
        },
        { transaction },
      );

      await transaction.commit();
      return { result: sale };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
