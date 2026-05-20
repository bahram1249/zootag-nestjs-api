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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { ContractPeriodStatusService } from './contract-period-status.service';
import { ContractPeriodStatusDto, ContractPeriodStatusFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { ContractPeriodStatusResponseDto } from './dto';

@ApiTags('Zootag-Admin-ContractPeriodStatuses')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/contractperiodstatuses', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class ContractPeriodStatusController {
  constructor(private readonly service: ContractPeriodStatusService) {}

  @ApiOperation({ description: 'show all contract period statuses' })
  @ApiJsonResponse({ type: ContractPeriodStatusResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractperiodstatuses.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ContractPeriodStatusFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show contract period status by given id' })
  @ApiJsonResponse({ type: ContractPeriodStatusResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractperiodstatuses.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create contract period status' })
  @ApiJsonResponse({ type: ContractPeriodStatusResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractperiodstatuses.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ContractPeriodStatusDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update contract period status' })
  @ApiJsonResponse({ type: ContractPeriodStatusResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractperiodstatuses.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: ContractPeriodStatusDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete contract period status' })
  @ApiJsonResponse({ type: ContractPeriodStatusResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractperiodstatuses.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
