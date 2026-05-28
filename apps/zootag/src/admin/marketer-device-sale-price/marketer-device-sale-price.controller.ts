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
import { ApiJsonResponse } from '@rahino/response';
import { MarketerDeviceSalePriceService } from './marketer-device-sale-price.service';
import {
  BatchMarketerDeviceSalePriceDto,
  MarketerDeviceSalePriceDto,
  MarketerDeviceSalePriceFilterDto,
  MarketerDeviceSalePriceResponseDto,
} from './dto';

@ApiTags('Zootag-Admin-MarketerDeviceSalePrices')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/zootag/admin/marketerDeviceSalePrices',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class MarketerDeviceSalePriceController {
  constructor(private readonly service: MarketerDeviceSalePriceService) {}

  @ApiOperation({ description: 'show all marketer device sale prices' })
  @ApiJsonResponse({ type: MarketerDeviceSalePriceResponseDto, isArray: true })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketerdevicesaleprices.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: MarketerDeviceSalePriceFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: MarketerDeviceSalePriceFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'batch upsert marketer device sale prices' })
  @ApiJsonResponse({
    type: MarketerDeviceSalePriceResponseDto,
    isArray: true,
    status: 200,
  })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketerdevicesaleprices.create',
  })
  @Post('/batch')
  @HttpCode(HttpStatus.OK)
  async batchUpsert(@Body() dto: BatchMarketerDeviceSalePriceDto) {
    return await this.service.batchUpsert(dto);
  }

  @ApiOperation({
    description: 'show marketer device sale price by given id',
  })
  @ApiJsonResponse({ type: MarketerDeviceSalePriceResponseDto })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketerdevicesaleprices.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create marketer device sale price' })
  @ApiJsonResponse({ type: MarketerDeviceSalePriceResponseDto, status: 201 })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketerdevicesaleprices.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: MarketerDeviceSalePriceDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update marketer device sale price' })
  @ApiJsonResponse({ type: MarketerDeviceSalePriceResponseDto })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketerdevicesaleprices.update',
  })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: MarketerDeviceSalePriceDto,
  ) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete marketer device sale price' })
  @ApiJsonResponse({ type: MarketerDeviceSalePriceResponseDto })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketerdevicesaleprices.delete',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
