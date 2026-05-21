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
import { ContractService } from './contract.service';
import { ContractDto, ContractFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { ContractResponseDto } from './dto';

@ApiTags('Zootag-Admin-Contracts')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/contracts', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class ContractController {
  constructor(private readonly service: ContractService) {}

  @ApiOperation({ description: 'show all contracts' })
  @ApiJsonResponse({ type: ContractResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contracts.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ContractFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ContractFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show contract by given id' })
  @ApiJsonResponse({ type: ContractResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contracts.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create contract' })
  @ApiJsonResponse({ type: ContractResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contracts.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ContractDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }

  @ApiOperation({ description: 'update contract' })
  @ApiJsonResponse({ type: ContractResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contracts.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: ContractDto, @GetUser() user: User) {
    return await this.service.update(id, dto, user);
  }

  @ApiOperation({ description: 'delete contract' })
  @ApiJsonResponse({ type: ContractResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.contracts.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
