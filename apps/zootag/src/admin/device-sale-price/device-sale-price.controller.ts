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
import { JwtGuard } from '@rahino/auth';
import { DeviceSalePriceService } from './device-sale-price.service';
import { DeviceSalePriceDto, DeviceSalePriceFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { DeviceSalePriceResponseDto } from './dto';

@ApiTags('Zootag-Admin-DeviceSalePrices')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/deviceSalePrices', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class DeviceSalePriceController {
  constructor(private readonly service: DeviceSalePriceService) {}

  @ApiOperation({ description: 'show all device sale prices' })
  @ApiJsonResponse({ type: DeviceSalePriceResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicetaleprices.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: DeviceSalePriceFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: DeviceSalePriceFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show device sale price by given id' })
  @ApiJsonResponse({ type: DeviceSalePriceResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicetaleprices.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create device sale price' })
  @ApiJsonResponse({ type: DeviceSalePriceResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicetaleprices.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: DeviceSalePriceDto) {
    return await this.service.create(dto);
  }
}
