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
import { CompanyService } from './company.service';
import { CompanyDto, CompanyFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { CompanyResponseDto } from './dto';

@ApiTags('Zootag-Admin-Companies')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/companies', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @ApiOperation({ description: 'show all companies' })
  @ApiJsonResponse({ type: CompanyResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.companies.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: CompanyFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show company by given id' })
  @ApiJsonResponse({ type: CompanyResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.companies.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create company' })
  @ApiJsonResponse({ type: CompanyResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.companies.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CompanyDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update company' })
  @ApiJsonResponse({ type: CompanyResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.companies.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: CompanyDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete company' })
  @ApiJsonResponse({ type: CompanyResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.companies.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
