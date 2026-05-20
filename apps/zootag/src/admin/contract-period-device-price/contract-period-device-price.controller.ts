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
import { ContractPeriodDevicePriceService } from './contract-period-device-price.service';
import {
  ContractPeriodDevicePriceDto,
  ContractPeriodDevicePriceFilterDto,
  ContractPeriodDevicePriceResponseDto,
} from './dto';
import { ApiJsonResponse } from '@rahino/response';

@ApiTags('Zootag-Admin-ContractPeriodDevicePrices')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/zootag/admin/contractperioddeviceprices',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ContractPeriodDevicePriceController {
  constructor(private readonly service: ContractPeriodDevicePriceService) {}

  @ApiOperation({ description: 'show all contract period device prices' })
  @ApiJsonResponse({
    type: ContractPeriodDevicePriceResponseDto,
    isArray: true,
  })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.contractperioddeviceprices.getall',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ContractPeriodDevicePriceFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({
    description: 'show contract period device price by given id',
  })
  @ApiJsonResponse({ type: ContractPeriodDevicePriceResponseDto })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.contractperioddeviceprices.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create contract period device price' })
  @ApiJsonResponse({ type: ContractPeriodDevicePriceResponseDto, status: 201 })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.contractperioddeviceprices.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ContractPeriodDevicePriceDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update contract period device price' })
  @ApiJsonResponse({ type: ContractPeriodDevicePriceResponseDto })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.contractperioddeviceprices.update',
  })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: ContractPeriodDevicePriceDto,
  ) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete contract period device price' })
  @ApiJsonResponse({ type: ContractPeriodDevicePriceResponseDto })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.contractperioddeviceprices.delete',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
