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
import { PetService } from './pet.service';
import { PetDto, PetFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { PetResponseDto } from './dto';

@ApiTags('Zootag-Admin-Pets')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/pets', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class PetController {
  constructor(private readonly service: PetService) {}

  @ApiOperation({ description: 'show all pets' })
  @ApiJsonResponse({ type: PetResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.pets.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: PetFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: PetFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show pet by given id' })
  @ApiJsonResponse({ type: PetResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.pets.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create pet' })
  @ApiJsonResponse({ type: PetResponseDto, status: 201 })
  @CheckPermission({ permissionSymbol: 'zootag.admin.pets.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: PetDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }

  @ApiOperation({ description: 'update pet' })
  @ApiJsonResponse({ type: PetResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.pets.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: PetDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(id, dto, user);
  }

  @ApiOperation({ description: 'delete pet' })
  @ApiJsonResponse({ type: PetResponseDto })
  @CheckPermission({ permissionSymbol: 'zootag.admin.pets.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
