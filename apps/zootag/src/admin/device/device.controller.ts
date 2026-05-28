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
import { GetUser, JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { DeviceService } from './device.service';
import { DeviceDto, DeviceFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { DeviceResponseDto } from './dto';

@ApiTags('Zootag-Admin-Devices')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/devices', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class DeviceController {
  constructor(private readonly service: DeviceService) {}

  @ApiOperation({ description: 'show all devices' })
  @ApiJsonResponse({ type: DeviceResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devices.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: DeviceFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: DeviceFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({
    description: 'show available devices (inventory = available)',
  })
  @ApiJsonResponse({ type: DeviceResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devices.getall' })
  @Get('/available')
  @ApiQuery({
    name: 'filter',
    type: DeviceFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAvailable(@Query() filter: DeviceFilterDto) {
    return await this.service.findAvailable(filter);
  }

  @ApiOperation({ description: 'show device by given id' })
  @ApiJsonResponse({ type: DeviceResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devices.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create device' })
  @ApiJsonResponse({ type: DeviceResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devices.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: DeviceDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }

  @ApiOperation({ description: 'update device' })
  @ApiJsonResponse({ type: DeviceResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devices.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: DeviceDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(id, dto, user);
  }

  @ApiOperation({ description: 'delete device' })
  @ApiJsonResponse({ type: DeviceResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.devices.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
