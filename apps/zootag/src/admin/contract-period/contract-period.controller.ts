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
import { ContractPeriodService } from './contract-period.service';
import { ContractPeriodDto, ContractPeriodFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { ContractPeriodResponseDto } from './dto';

@ApiTags('Zootag-Admin-ContractPeriods')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/contractPeriods', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class ContractPeriodController {
  constructor(private readonly service: ContractPeriodService) {}

  @ApiOperation({ description: 'show all contract periods' })
  @ApiJsonResponse({ type: ContractPeriodResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractperiods.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ContractPeriodFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ContractPeriodFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show contract period by given id' })
  @ApiJsonResponse({ type: ContractPeriodResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractperiods.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create contract period' })
  @ApiJsonResponse({ type: ContractPeriodResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractperiods.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ContractPeriodDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }

  @ApiOperation({ description: 'update contract period' })
  @ApiJsonResponse({ type: ContractPeriodResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractperiods.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: ContractPeriodDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(id, dto, user);
  }

  @ApiOperation({ description: 'delete contract period' })
  @ApiJsonResponse({ type: ContractPeriodResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractperiods.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
