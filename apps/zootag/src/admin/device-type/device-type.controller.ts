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
import { JwtGuard } from '@rahino/auth';
import { DeviceTypeService } from './device-type.service';
import { DeviceTypeDto, DeviceTypeFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { DeviceTypeResponseDto } from './dto';

@ApiTags('Zootag-Admin-DeviceTypes')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/deviceTypes', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class DeviceTypeController {
  constructor(private readonly service: DeviceTypeService) {}

  @ApiOperation({ description: 'show all device types' })
  @ApiJsonResponse({ type: DeviceTypeResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicetypes.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: DeviceTypeFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: DeviceTypeFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show device type by given id' })
  @ApiJsonResponse({ type: DeviceTypeResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicetypes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create device type' })
  @ApiJsonResponse({ type: DeviceTypeResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicetypes.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: DeviceTypeDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update device type' })
  @ApiJsonResponse({ type: DeviceTypeResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicetypes.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: DeviceTypeDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete device type' })
  @ApiJsonResponse({ type: DeviceTypeResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicetypes.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
