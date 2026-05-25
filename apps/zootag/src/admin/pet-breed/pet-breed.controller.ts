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
import { PetBreedDto, PetBreedFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { PetBreedResponseDto } from './dto';
import { PetBreedService } from './pet-breed.service';

@ApiTags('Zootag-Admin-PetBreedes')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/PetBreedes', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class PetBreedController {
  constructor(private readonly service: PetBreedService) {}

  @ApiOperation({ description: 'show all pet breedes' })
  @ApiJsonResponse({ type: PetBreedResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.petbreeds.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: PetBreedFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: PetBreedFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show pet breed by given id' })
  @ApiJsonResponse({ type: PetBreedResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.petbreeds.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create pet breed' })
  @ApiJsonResponse({ type: PetBreedResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.petbreeds.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: PetBreedDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update pet breed' })
  @ApiJsonResponse({ type: PetBreedResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.petbreeds.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: PetBreedDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete pet breed' })
  @ApiJsonResponse({ type: PetBreedResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.petbreeds.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
