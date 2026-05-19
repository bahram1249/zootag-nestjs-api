import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { PermissionGroup } from '@rahino/database';
import { PermissionGroupGetDto } from './dto';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class PermissionGroupService {
  constructor(
    @InjectModel(PermissionGroup)
    private readonly repository: typeof PermissionGroup,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(filter: PermissionGroupGetDto) {
    let qb = new QueryOptionsBuilder().filter({
      [Op.and]: [
        {
          permissionGroupName: { [Op.like]: filter.search },
        },
        this.seqHelp.whereIsNullColumnEqualToValue(
          'PermissionGroup.visibility',
          1,
          1,
        ),
      ],
    });

    const count = await this.repository.count(qb.build());

    qb = qb
      .attributes(['id', 'permissionGroupName', 'order', 'createdAt', 'updatedAt'])
      .include([
        {
          model: Permission,
          as: 'permissions',
          where: this.seqHelp.whereIsNullColumnEqualToValue(
            'permissions.visibility',
            1,
            1,
          ),
          attributes: [
            'id',
            'permissionSymbol',
            'permissionName',
            'permissionUrl',
            'permissionMethod',
            'createdAt',
            'updatedAt',
          ],
        },
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.repository.findAll(qb.build()),
      total: count,
    };
  }

  async findById(id: number) {
    const permissionGroup = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'permissionGroupName', 'order', 'createdAt', 'updatedAt'])
        .include([
          {
            model: Permission,
            as: 'permissions',
            attributes: [
              'id',
              'permissionSymbol',
              'permissionName',
              'permissionUrl',
              'permissionMethod',
              'createdAt',
              'updatedAt',
            ],
            where: this.seqHelp.whereIsNullColumnEqualToValue(
              'permissions.visibility',
              1,
              1,
            ),
          },
        ])
        .filter({
          [Op.and]: [
            { id },
            this.seqHelp.whereIsNullColumnEqualToValue(
              'PermissionGroup.visibility',
              1,
              1,
            ),
          ],
        })
        .build(),
    );
    if (!permissionGroup) throw new NotFoundException('Not Found!');
    return {
      result: permissionGroup,
    };
  }
}
