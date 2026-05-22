import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto, UsernameDto, RefreshDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@rahino/database';
import { InjectModel } from '@nestjs/sequelize';
import { LocalizationService } from 'apps/main/src/common/localization';
import { CoreSession } from '@rahino/localdatabase/models/core';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(CoreSession)
    private readonly sessionRepository: typeof CoreSession,
    private readonly localizationService: LocalizationService,
  ) {}

  async signup(dto: AuthDto, ipAddress?: string, userAgent?: string) {
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

    return this.createSessionAndTokens(user, ipAddress, userAgent);
  }

  async signin(dto: AuthDto, ipAddress?: string, userAgent?: string) {
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
    return this.createSessionAndTokens(user, ipAddress, userAgent);
  }

  async refresh(dto: RefreshDto) {
    const session = await this.sessionRepository.findByPk(dto.sessionId);
    if (!session || session.isRevoked || session.expiresAt <= new Date()) {
      throw new UnauthorizedException(
        this.localizationService.translate('core.credentials_incorrect'),
      );
    }

    const refreshTokenMatches = await bcrypt.compare(
      dto.refresh_token,
      session.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(
        this.localizationService.translate('core.credentials_incorrect'),
      );
    }

    const user = await this.userRepository.findByPk(session.userId);
    if (!user) {
      throw new UnauthorizedException(
        this.localizationService.translate('core.credentials_incorrect'),
      );
    }

    const rawRefreshToken = this.generateRefreshToken();
    const hashedRefreshToken = await bcrypt.hash(rawRefreshToken, 10);
    await session.update({
      refreshToken: hashedRefreshToken,
      lastActivityAt: new Date(),
    });

    return this.buildTokenResponse(user, session, rawRefreshToken);
  }

  async logout(req: Request) {
    const sessionId = this.extractSessionId(req);
    if (!sessionId) return { result: { success: false } };
    const session = await this.sessionRepository.findByPk(sessionId);
    if (!session) return { result: { success: false } };
    await session.update({ isRevoked: true });
    return { result: { success: true } };
  }

  async getSessions(userId: number) {
    const result = await this.sessionRepository.findAll({
      where: { userId, isRevoked: false },
      attributes: [
        'id',
        'ipAddress',
        'userAgent',
        'expiresAt',
        'isRevoked',
        'lastActivityAt',
        'createdAt',
      ],
      order: [['createdAt', 'DESC']],
    });
    return { result };
  }

  async revokeSession(sessionId: number, userId: number) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, userId },
    });
    if (!session) {
      throw new ForbiddenException(
        this.localizationService.translate('core.not_found'),
      );
    }
    await session.update({ isRevoked: true });
    return { result: { success: true } };
  }

  async signToken(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, sessionId: '0' };
    const secret = this.config.get<string>('JWT_SECRET');
    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') || '15m';
    const token = await this.jwt.signAsync(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
    return { access_token: token };
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

  private async createSessionAndTokens(
    user: User,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const refreshTokenRaw = this.generateRefreshToken();
    const refreshTokenHash = await bcrypt.hash(refreshTokenRaw, 10);
    const refreshTokenExpiresIn =
      this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d';

    const session = await this.sessionRepository.create({
      userId: user.id,
      refreshToken: refreshTokenHash,
      ipAddress: ipAddress || '',
      userAgent: userAgent || '',
      expiresAt: this.parseExpiry(refreshTokenExpiresIn),
    });

    return this.buildTokenResponse(user, session, refreshTokenRaw);
  }

  private async buildTokenResponse(
    user: User,
    session: CoreSession,
    rawRefreshToken?: string,
  ) {
    const token = await this.generateAccessToken(user, Number(session.id));
    return {
      result: {
        ...token,
        refresh_token: rawRefreshToken || session.refreshToken,
        refresh_token_expires_at: session.expiresAt,
        session_id: session.id,
      },
    };
  }

  private async generateAccessToken(
    user: User,
    sessionId: number,
  ): Promise<{
    access_token: string;
    expires_in: number;
    expires_at: Date;
  }> {
    const payload = {
      sub: user.id,
      sessionId: String(sessionId),
    };
    const secret = this.config.get<string>('JWT_SECRET');
    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') || '15m';

    const token = await this.jwt.signAsync(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });

    const expirationMs = this.parseExpiryToMs(expiresIn);
    const expiresAt = new Date(Date.now() + expirationMs);

    return {
      access_token: token,
      expires_in: Math.floor(expirationMs / 1000),
      expires_at: expiresAt,
    };
  }

  private extractSessionId(req: Request): number | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwt.decode(token) as any;
      return payload?.sessionId ? Number(payload.sessionId) : null;
    } catch {
      return null;
    }
  }

  private generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }

  private parseExpiry(expiresIn: string): Date {
    return new Date(Date.now() + this.parseExpiryToMs(expiresIn));
  }

  private parseExpiryToMs(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 15 * 60 * 1000;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 15 * 60 * 1000;
    }
  }
}
