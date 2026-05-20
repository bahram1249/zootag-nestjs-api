import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AuthDto, UsernameDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@rahino/database';
import { InjectModel } from '@nestjs/sequelize';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    private readonly localizationService: LocalizationService,
  ) {}

  async signup(dto: AuthDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });
    if (findUser) {
      throw new ForbiddenException(
        this.localizationService.translate('core.credentials_taken'),
      );
    }

    const user = await this.userRepository.create({
      username: dto.username,
      password: dto.password,
    });

    return this.signToken(user);
  }

  async signin(dto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });
    if (!user)
      throw new ForbiddenException(
        this.localizationService.translate('core.credentials_incorrect'),
      );

    const pwMatches = await user.validPasswordAsync(dto.password);
    if (!pwMatches)
      throw new ForbiddenException(
        this.localizationService.translate('core.credentials_incorrect'),
      );
    return this.signToken(user);
  }

  async findUser(dto: UsernameDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });
    if (user)
      throw new ForbiddenException(
        this.localizationService.translate('core.username_taken'),
      );
    return {
      result: 'can be reserved',
    };
  }

  public async signToken(user: User): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
    };
    const secret = this.config.get<string>('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
