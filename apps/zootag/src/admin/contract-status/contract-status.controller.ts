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
import { ContractStatusService } from './contract-status.service';
import { ContractStatusDto, ContractStatusFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { ContractStatusResponseDto } from './dto';

@ApiTags('Zootag-Admin-ContractStatuses')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/contractstatuses', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class ContractStatusController {
  constructor(private readonly service: ContractStatusService) {}

  @ApiOperation({ description: 'show all contract statuses' })
  @ApiJsonResponse({ type: ContractStatusResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractstatuses.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ContractStatusFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show contract status by given id' })
  @ApiJsonResponse({ type: ContractStatusResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractstatuses.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create contract status' })
  @ApiJsonResponse({ type: ContractStatusResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractstatuses.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ContractStatusDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update contract status' })
  @ApiJsonResponse({ type: ContractStatusResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractstatuses.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: ContractStatusDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete contract status' })
  @ApiJsonResponse({ type: ContractStatusResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contractstatuses.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
