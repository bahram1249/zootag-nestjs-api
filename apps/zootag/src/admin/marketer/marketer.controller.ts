import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { MarketerService } from './marketer.service';
import { MarketerDto, MarketerFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { MarketerResponseDto } from './dto';

@ApiTags('Zootag-Admin-Marketers')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/marketers', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class MarketerController {
  constructor(private readonly service: MarketerService) {}

  @ApiOperation({ description: 'show all marketers' })
  @ApiJsonResponse({ type: MarketerResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.marketers.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: MarketerFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: MarketerFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show marketer by given id' })
  @ApiJsonResponse({ type: MarketerResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.marketers.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create marketer' })
  @ApiJsonResponse({ type: MarketerResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.marketers.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: MarketerDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }

  @ApiOperation({ description: 'update marketer' })
  @ApiJsonResponse({ type: MarketerResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.marketers.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: MarketerDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(id, dto, user);
  }

  @ApiOperation({ description: 'delete marketer' })
  @ApiJsonResponse({ type: MarketerResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.marketers.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
