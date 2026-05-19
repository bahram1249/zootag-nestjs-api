import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Role } from '@rahino/database';
import { RoleGetDto } from './dto';
import { UserRole } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly repository: typeof Role,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
  ) {}

  async findAll(userId: bigint, filter: RoleGetDto) {
    const userRoles = await this.userRoleRepository.findAll(
      new QueryOptionsBuilder().filter({ userId }).build(),
    );
    const roleIds = userRoles.map((userRole) => userRole.roleId);

    let qb = new QueryOptionsBuilder().filter({ id: { [Op.in]: roleIds } });
    const count = await this.repository.count(qb.build());

    qb = qb
      .attributes(['id', 'roleName', 'createdAt', 'updatedAt'])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.repository.findAll(qb.build()),
      total: count,
    };
  }

  async findAllRoleId(userId: bigint): Promise<number[]> {
    const roles = await this.userRoleRepository.findAll(
      new QueryOptionsBuilder()
        .attributes(['id', 'roleId'])
        .filter({ userId: userId })
        .build(),
    );
    return roles.map((item) => item.roleId);
  }

  async isAccessToStaticRole(
    userId: bigint,
    staticId: number,
  ): Promise<boolean> {
    const staticRole = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ static_id: staticId }).build(),
    );
    if (!staticRole) return false;
    const userRole = await this.userRoleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: userId })
        .filter({ roleId: staticRole.id })
        .build(),
    );
    if (!userRole) return false;
    return true;
  }
}
