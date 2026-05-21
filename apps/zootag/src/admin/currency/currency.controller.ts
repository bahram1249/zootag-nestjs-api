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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { CurrencyService } from './currency.service';
import { CurrencyDto, CurrencyFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { CurrencyResponseDto } from './dto';

@ApiTags('Zootag-Admin-Currencies')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/currencies', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @ApiOperation({ description: 'show all currencies' })
  @ApiJsonResponse({ type: CurrencyResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.currencies.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: CurrencyFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: CurrencyFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show currency by given id' })
  @ApiJsonResponse({ type: CurrencyResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.currencies.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create currency' })
  @ApiJsonResponse({ type: CurrencyResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.currencies.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CurrencyDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }

  @ApiOperation({ description: 'update currency' })
  @ApiJsonResponse({ type: CurrencyResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.currencies.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: CurrencyDto, @GetUser() user: User) {
    return await this.service.update(id, dto, user);
  }

  @ApiOperation({ description: 'delete currency' })
  @ApiJsonResponse({ type: CurrencyResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.currencies.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
