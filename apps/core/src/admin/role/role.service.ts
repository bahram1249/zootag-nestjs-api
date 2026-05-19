import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@rahino/database';
import { Op } from 'sequelize';
import { Permission } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { RoleGetDto, RoleDto } from './dto';
import { UserRole } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectModel(Permission)
    private readonly permissionRepository: typeof Permission,
    @InjectModel(RolePermission)
    private readonly rolePermissionRepository: typeof RolePermission,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: RoleGetDto) {
    let qb = new QueryOptionsBuilder().filter({
      roleName: { [Op.like]: filter.search },
    });

    const count = await this.roleRepository.count(qb.build());

    qb = qb
      .attributes(['id', 'roleName', 'static_id', 'createdAt', 'updatedAt'])
      .include([{ model: Permission }])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.roleRepository.findAll(qb.build()),
      total: count,
    };
  }

  async findById(id: number) {
    return {
      result: await this.roleRepository.findOne(
        new QueryOptionsBuilder()
          .include([{ model: Permission }])
          .attributes(['id', 'roleName', 'static_id', 'createdAt', 'updatedAt'])
          .filter({ id })
          .build(),
      ),
    };
  }

  async create(dto: RoleDto) {
    let role = await this.roleRepository.findOne(
      new QueryOptionsBuilder().filter({ roleName: dto.roleName }).build(),
    );
    if (role)
      throw new ForbiddenException(
        this.localizationService.translate('core.credentials_taken'),
      );

    if (
      dto.permissions &&
      (dto.ignorePermission == null || dto.ignorePermission == false)
    ) {
      for (let index = 0; index < dto.permissions.length; index++) {
        const permissionId = dto.permissions[index];
        const permission = await this.permissionRepository.findOne(
          new QueryOptionsBuilder().filter({ id: permissionId }).build(),
        );
        if (!permission)
          throw new BadRequestException(
            this.localizationService.translate('core.permission_not_found', {
              id: permissionId,
            }),
          );
      }
    }

    const roleObj = JSON.parse(JSON.stringify(dto));
    role = await this.roleRepository.create(roleObj);

    if (
      dto.permissions &&
      (dto.ignorePermission == null || dto.ignorePermission == false)
    ) {
      for (let index = 0; index < dto.permissions.length; index++) {
        const permissionId = dto.permissions[index];
        await this.rolePermissionRepository.create({
          roleId: role.id,
          permissionId: permissionId,
        });
      }
    }

    role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .include([{ model: Permission }])
        .attributes(['id', 'roleName', 'static_id', 'createdAt', 'updatedAt'])
        .filter({ id: role.id })
        .build(),
    );
    return {
      result: role,
    };
  }

  async update(roleId: number, dto: RoleDto) {
    let role = await this.roleRepository.findOne(
      new QueryOptionsBuilder().filter({ id: roleId }).build(),
    );
    if (!role)
      throw new NotFoundException(
        this.localizationService.translate('core.not_found'),
      );

    if (
      dto.permissions &&
      (dto.ignorePermission == null || dto.ignorePermission == false)
    ) {
      for (let index = 0; index < dto.permissions.length; index++) {
        const permissionId = dto.permissions[index];
        const permission = await this.permissionRepository.findOne(
          new QueryOptionsBuilder().filter({ id: permissionId }).build(),
        );
        if (!permission)
          throw new BadRequestException(
            this.localizationService.translate('core.permission_not_found', {
              id: permissionId,
            }),
          );
      }
    }

    await this.roleRepository.update(JSON.parse(JSON.stringify(dto)), {
      where: {
        id: roleId,
      },
    });

    if (dto.ignorePermission == null || dto.ignorePermission == false) {
      await this.rolePermissionRepository.destroy({
        where: {
          roleId: roleId,
        },
      });

      if (dto.permissions) {
        for (let index = 0; index < dto.permissions.length; index++) {
          const permissionId = dto.permissions[index];
          await this.rolePermissionRepository.create({
            roleId: roleId,
            permissionId: permissionId,
          });
        }
      }
    }

    role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .include([{ model: Permission }])
        .attributes(['id', 'roleName', 'static_id', 'createdAt', 'updatedAt'])
        .filter({ id: roleId })
        .build(),
    );
    return {
      result: role,
    };
  }

  async delete(roleId: number) {
    const item = await this.roleRepository.findOne(
      new QueryOptionsBuilder().filter({ id: roleId }).build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    if (item.static_id != null) {
      throw new BadRequestException(
        this.localizationService.translate('core.role_cannot_be_deleted'),
      );
    }

    await this.rolePermissionRepository.destroy({
      where: {
        roleId: roleId,
      },
    });

    await this.userRoleRepository.destroy({
      where: {
        roleId: roleId,
      },
    });

    await this.roleRepository.destroy({
      where: {
        id: roleId,
      },
    });

    return {
      result: item,
    };
  }
}
