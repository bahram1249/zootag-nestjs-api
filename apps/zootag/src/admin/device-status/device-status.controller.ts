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
import { DeviceStatusService } from './device-status.service';
import { DeviceStatusDto, DeviceStatusFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { DeviceStatusResponseDto } from './dto';

@ApiTags('Zootag-Admin-DeviceStatuses')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/deviceStatuses', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class DeviceStatusController {
  constructor(private readonly service: DeviceStatusService) {}

  @ApiOperation({ description: 'show all device statuses' })
  @ApiJsonResponse({ type: DeviceStatusResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicestatuses.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: DeviceStatusFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: DeviceStatusFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show device status by given id' })
  @ApiJsonResponse({ type: DeviceStatusResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicestatuses.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create device status' })
  @ApiJsonResponse({ type: DeviceStatusResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicestatuses.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: DeviceStatusDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update device status' })
  @ApiJsonResponse({ type: DeviceStatusResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicestatuses.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: DeviceStatusDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete device status' })
  @ApiJsonResponse({ type: DeviceStatusResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devicestatuses.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
