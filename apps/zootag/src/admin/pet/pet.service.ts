import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';
import { LocalizationMapperService } from '@rahino/zootag/shared/localization-mapper';
import { ZTPet, ZTPetBreed, ZTPetType, ZTDevice } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { PetFilterDto, PetDto } from './dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(ZTPet)
    private readonly repository: typeof ZTPet,
    private readonly localizationService: LocalizationService,
    private readonly localizationMapperService: LocalizationMapperService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) { }

  async findAll(filter: PetFilterDto) {
    let qb = new QueryOptionsBuilder()
      .filter({ isDeleted: 0 })
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search },
      });
    const total = await this.repository.count(qb.build());
    qb = qb
      .attributes([
        'id',
        'name',
        'ownerId',
        'breedId',
        'petTypeId',
        'deviceId',
        'birthDate',
        'isActive',
      ])
      .include([
        {
          model: ZTPetBreed,
          as: 'breed',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: ZTPetType,
          as: 'petType',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'firstname', 'lastname'],
          required: false,
        },
        {
          model: ZTDevice,
          as: 'device',
          attributes: ['id', 'serialNumber'],
          required: false,
        },
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const result = this.localizationMapperService.localizeItems(
      (await this.repository.findAll(qb.build())).map((r) => r.toJSON()),
      { breed: 'petBreed', petType: 'petType' },
    );
    return { result, total };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter({ isDeleted: 0 })
        .attributes([
          'id',
          'name',
          'ownerId',
          'breedId',
          'petTypeId',
          'deviceId',
          'birthDate',
          'isActive',
        ])
        .include([
          {
            model: ZTPetBreed,
            as: 'breed',
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: ZTPetType,
            as: 'petType',
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'firstname', 'lastname'],
            required: false,
          },
          {
            model: ZTDevice,
            as: 'device',
            attributes: ['id', 'serialNumber'],
            required: false,
          },
        ])
        .build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.pet_not_found'),
      );
    return {
      result: this.localizationMapperService.localizeItem(item.toJSON(), {
        breed: 'petBreed',
        petType: 'petType',
      }),
    };
  }

  async create(dto: PetDto, user: User) {
    const mapped = this.mapper.map(dto, PetDto, ZTPet).toJSON();
    const item = await this.repository.create({
      ...mapped,
      createdUserId: BigInt(user.id),
      updatedUserId: BigInt(user.id),
    });
    return { result: item };
  }

  async update(id: number, dto: PetDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).filter({ isDeleted: 0 }).build(),
    );
    if (!item)
      throw new NotFoundException(
        this.localizationService.translate('zootag.pet_not_found'),
      );
    const mapped = this.mapper.map(dto, PetDto, ZTPet).toJSON();
    await item.update({
      ...mapped,
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
        this.localizationService.translate('zootag.pet_not_found'),
      );
    await item.update({ isDeleted: true });
    return { result: item };
  }
}
