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
import { PetTypeDto, PetTypeFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { PetTypeResponseDto } from './dto';
import { PetTypeService } from './pet-type.service';

@ApiTags('Zootag-Admin-PetTypes')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/petTypes', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class PetTypeController {
  constructor(private readonly service: PetTypeService) {}

  @ApiOperation({ description: 'show all pet types' })
  @ApiJsonResponse({ type: PetTypeResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.pettypes.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: PetTypeFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: PetTypeFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show pet type by given id' })
  @ApiJsonResponse({ type: PetTypeResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.pettypes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create pet type' })
  @ApiJsonResponse({ type: PetTypeResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.pettypes.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: PetTypeDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update pet type' })
  @ApiJsonResponse({ type: PetTypeResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.pettypes.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: PetTypeDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete pet type' })
  @ApiJsonResponse({ type: PetTypeResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.pettypes.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
