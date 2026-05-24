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
import { DeviceSaleService } from './device-sale.service';
import {
  DeviceSaleDto,
  DeviceSaleFilterDto,
  DeviceSalePreviewQueryDto,
  DeviceSalePreviewResponseDto,
} from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { DeviceSaleResponseDto } from './dto';

@ApiTags('Zootag-Admin-DeviceSales')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/deviceSales', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class DeviceSaleController {
  constructor(private readonly service: DeviceSaleService) {}

  @ApiOperation({ description: 'show all device sales' })
  @ApiJsonResponse({ type: DeviceSaleResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicesales.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: DeviceSaleFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: DeviceSaleFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({
    description: 'preview commission calculation before creating a sale',
  })
  @ApiJsonResponse({ type: DeviceSalePreviewResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicesales.create' })
  @Get('/preview')
  @HttpCode(HttpStatus.OK)
  async preview(@Query() dto: DeviceSalePreviewQueryDto) {
    return await this.service.preview(dto);
  }

  @ApiOperation({ description: 'show device sale by given id' })
  @ApiJsonResponse({ type: DeviceSaleResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicesales.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create device sale (locks device as sold)' })
  @ApiJsonResponse({ type: DeviceSaleResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicesales.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: DeviceSaleDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }
}
