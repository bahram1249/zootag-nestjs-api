import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthDto,
  UsernameDto,
  AuthResponseDto,
  FindUserResponseDto,
  RefreshDto,
  SessionResponseDto,
  LogoutResponseDto,
  RevokeSessionResponseDto,
} from './dto';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiJsonResponse } from '@rahino/response';
import { GetUser, JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { Request } from 'express';

@ApiTags('Auth')
@Controller({
  path: '/api/core/auth',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ description: 'signup user' })
  @ApiJsonResponse({ type: AuthResponseDto, status: 201 })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: AuthDto, @Req() req: Request) {
    return await this.authService.signup(
      dto,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @ApiOperation({ description: 'signin user' })
  @ApiJsonResponse({ type: AuthResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDto, @Req() req: Request) {
    return await this.authService.signin(
      dto,
      req.ip,
      req.headers['user-agent'],
    );
  }

  @ApiOperation({ description: 'refresh access token' })
  @ApiJsonResponse({ type: AuthResponseDto })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    return await this.authService.refresh(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ description: 'logout current session' })
  @ApiJsonResponse({ type: LogoutResponseDto })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    return await this.authService.logout(req);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ description: 'list active sessions' })
  @ApiJsonResponse({ type: SessionResponseDto, isArray: true })
  @Get('sessions')
  @HttpCode(HttpStatus.OK)
  async getSessions(@GetUser() user: User) {
    return await this.authService.getSessions(Number(user.id));
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ description: 'revoke a session' })
  @ApiJsonResponse({ type: RevokeSessionResponseDto })
  @Delete('sessions/:id')
  @HttpCode(HttpStatus.OK)
  async revokeSession(@GetUser() user: User, @Param('id') id: number) {
    return await this.authService.revokeSession(id, Number(user.id));
  }

  @ApiOperation({ description: 'find user by username' })
  @ApiJsonResponse({ type: FindUserResponseDto })
  @Post('findUser')
  @HttpCode(HttpStatus.OK)
  async findUser(@Body() dto: UsernameDto) {
    return await this.authService.findUser(dto);
  }
}
