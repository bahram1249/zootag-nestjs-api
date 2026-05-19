import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { RolePermission } from '@rahino/database';
import { PermissionGroup } from '@rahino/database';
import { PermissionGetDto } from './dto';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission)
    private readonly permissionRepository: typeof Permission,
    @InjectModel(RolePermission)
    private readonly rolePermissionRepository: typeof RolePermission,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(filter: PermissionGetDto) {
    let qb = new QueryOptionsBuilder().filter({
      [Op.and]: [
        {
          [Op.or]: [
            { permissionName: { [Op.like]: filter.search } },
            { permissionUrl: { [Op.like]: filter.search } },
          ],
        },
        this.seqHelp.whereIsNullColumnEqualToValue('permission.visibility', 1, 1),
      ],
    });

    if (filter.roleId) {
      const permissions = await this.rolePermissionRepository.findAll(
        new QueryOptionsBuilder()
          .filter({ roleId: filter.roleId })
          .build(),
      );
      const permissionIds = permissions.map((p) => p.id);
      qb = qb.filter(
        Sequelize.where(Sequelize.col('id'), { [Op.in]: permissionIds }),
      );
    }

    const count = await this.permissionRepository.count(qb.build());

    qb = qb
      .attributes([
        'id',
        'permissionName',
        'permissionUrl',
        'permissionSymbol',
        'permissionMethod',
        'permissionGroupId',
        'visibility',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          model: PermissionGroup,
          as: 'permissionGroup',
          attributes: ['id', 'permissionGroupName'],
        },
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.permissionRepository.findAll(qb.build()),
      total: count,
    };
  }

  async findById(id: number) {
    const permission = await this.permissionRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: PermissionGroup,
            as: 'permissionGroup',
            attributes: ['id', 'permissionGroupName'],
          },
        ])
        .attributes([
          'id',
          'permissionName',
          'permissionUrl',
          'permissionSymbol',
          'permissionMethod',
          'permissionGroupId',
          'visibility',
          'createdAt',
          'updatedAt',
        ])
        .filter({ id })
        .build(),
    );
    if (!permission) throw new NotFoundException('Not Found!');
    return {
      result: permission,
    };
  }
}
