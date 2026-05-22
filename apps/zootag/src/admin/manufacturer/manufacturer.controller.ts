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
import { JwtGuard } from '@rahino/auth';
import { ManufacturerService } from './manufacturer.service';
import { ManufacturerDto, ManufacturerFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { ManufacturerResponseDto } from './dto';

@ApiTags('Zootag-Admin-Manufacturers')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/manufacturers', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class ManufacturerController {
  constructor(private readonly service: ManufacturerService) {}

  @ApiOperation({ description: 'show all manufacturers' })
  @ApiJsonResponse({ type: ManufacturerResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.manufacturers.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ManufacturerFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ManufacturerFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show manufacturer by given id' })
  @ApiJsonResponse({ type: ManufacturerResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.manufacturers.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create manufacturer' })
  @ApiJsonResponse({ type: ManufacturerResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.manufacturers.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ManufacturerDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update manufacturer' })
  @ApiJsonResponse({ type: ManufacturerResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.manufacturers.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: ManufacturerDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete manufacturer' })
  @ApiJsonResponse({ type: ManufacturerResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.manufacturers.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
