import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { CurrencyHistoryService } from './currency-history.service';
import { CurrencyHistoryDto, CurrencyHistoryFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { CurrencyHistoryResponseDto } from './dto';

@ApiTags('Zootag-Admin-CurrencyHistories')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/currencyHistories', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class CurrencyHistoryController {
  constructor(private readonly service: CurrencyHistoryService) {}

  @ApiOperation({ description: 'show all currency histories' })
  @ApiJsonResponse({ type: CurrencyHistoryResponseDto, isArray: true })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.currencyhistories.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: CurrencyHistoryFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: CurrencyHistoryFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show currency history by given id' })
  @ApiJsonResponse({ type: CurrencyHistoryResponseDto })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.currencyhistories.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create currency history' })
  @ApiJsonResponse({ type: CurrencyHistoryResponseDto, status: 201 })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.currencyhistories.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CurrencyHistoryDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }
}
