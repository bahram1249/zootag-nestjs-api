import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@rahino/database';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter/types';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { UserDto } from './dto';
import { UserRole } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: ListFilter) {
    let qb = new QueryOptionsBuilder()
      .include([{ model: Role }])
      .filter({ username: { [Op.like]: filter.search } });

    const count = await this.userRepository.count(qb.build());

    qb = qb
      .attributes([
        'id',
        'firstname',
        'lastname',
        'username',
        'email',
        'phoneNumber',
        'mustChangePassword',
        'lastPasswordChangeDate',
        'profilePhotoAttachmentId',
        'static_id',
        'birthDate',
        'createdAt',
        'updatedAt',
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.userRepository.findAll(qb.build()),
      total: count,
    };
  }

  async findById(id: bigint) {
    return {
      result: await this.userRepository.findOne(
        new QueryOptionsBuilder()
          .include([{ model: Role }])
          .attributes([
            'id',
            'firstname',
            'lastname',
            'username',
            'email',
            'phoneNumber',
            'mustChangePassword',
            'lastPasswordChangeDate',
            'profilePhotoAttachmentId',
            'static_id',
            'birthDate',
            'createdAt',
            'updatedAt',
          ])
          .filter({ id })
          .build(),
      ),
    };
  }

  async create(dto: UserDto) {
    let user = await this.userRepository.findOne(
      new QueryOptionsBuilder().filter({ username: dto.username }).build(),
    );
    if (user)
      throw new ForbiddenException(
        this.localizationService.translate('core.credentials_taken'),
      );
    if (dto.email) {
      user = await this.userRepository.findOne(
        new QueryOptionsBuilder().filter({ email: dto.email }).build(),
      );
      if (user)
        throw new ForbiddenException(
          this.localizationService.translate('core.credentials_taken'),
        );
    }

    if (dto.roles && (dto.ignoreRole == null || dto.ignoreRole == false)) {
      for (let index = 0; index < dto.roles.length; index++) {
        const roleId = dto.roles[index];
        const role = await this.roleRepository.findOne(
          new QueryOptionsBuilder().filter({ id: roleId }).build(),
        );
        if (!role)
          throw new BadRequestException(
            this.localizationService.translate('core.role_not_found', {
              id: roleId,
            }),
          );
      }
    }

    const userObj = JSON.parse(JSON.stringify(dto));
    userObj.password = dto.username;
    user = await this.userRepository.create(userObj);

    if (dto.roles && (dto.ignoreRole == null || dto.ignoreRole == false)) {
      for (let index = 0; index < dto.roles.length; index++) {
        const roleId = dto.roles[index];
        await this.userRoleRepository.create({
          userId: user.id,
          roleId: roleId,
        });
      }
    }

    user = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .include([{ model: Role }])
        .attributes([
          'id',
          'firstname',
          'lastname',
          'username',
          'email',
          'phoneNumber',
          'mustChangePassword',
          'lastPasswordChangeDate',
          'profilePhotoAttachmentId',
          'static_id',
          'birthDate',
          'createdAt',
          'updatedAt',
        ])
        .filter({ id: user.id })
        .build(),
    );
    return {
      result: user,
    };
  }

  async update(userId: bigint, dto: UserDto) {
    let user = await this.userRepository.findOne(
      new QueryOptionsBuilder().filter({ id: userId }).build(),
    );
    if (!user)
      throw new NotFoundException(
        this.localizationService.translate('core.not_found'),
      );
    user = await this.userRepository.findOne(
      new QueryOptionsBuilder().filter({ username: dto.username }).build(),
    );
    if (user != null && user.id != userId) {
      throw new BadRequestException(
        this.localizationService.translate(
          'core.username_given_to_another_user',
        ),
      );
    }

    if (dto.roles && (dto.ignoreRole == null || dto.ignoreRole == false)) {
      for (let index = 0; index < dto.roles.length; index++) {
        const roleId = dto.roles[index];
        const role = await this.roleRepository.findOne(
          new QueryOptionsBuilder().filter({ id: roleId }).build(),
        );
        if (!role)
          throw new BadRequestException(
            this.localizationService.translate('core.role_not_found', {
              id: roleId,
            }),
          );
      }
    }

    await this.userRepository.update(JSON.parse(JSON.stringify(dto)), {
      where: {
        id: userId,
      },
    });

    if (dto.ignoreRole == null || dto.ignoreRole == false) {
      await this.userRoleRepository.destroy({
        where: {
          userId: userId,
        },
      });

      if (dto.roles) {
        for (let index = 0; index < dto.roles.length; index++) {
          const roleId = dto.roles[index];
          await this.userRoleRepository.create({
            userId: user.id,
            roleId: roleId,
          });
        }
      }
    }

    user = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .include([{ model: Role }])
        .attributes([
          'id',
          'firstname',
          'lastname',
          'username',
          'email',
          'phoneNumber',
          'mustChangePassword',
          'lastPasswordChangeDate',
          'profilePhotoAttachmentId',
          'static_id',
          'birthDate',
          'createdAt',
          'updatedAt',
        ])
        .filter({ id: userId })
        .build(),
    );
    return {
      result: user,
    };
  }
}
