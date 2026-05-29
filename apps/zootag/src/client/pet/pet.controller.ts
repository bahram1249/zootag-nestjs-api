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
import { DeviceLookupResponseDto } from './dto';

@ApiTags('Zootag-Client-Pets')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({ path: '/api/zootag/client/pets', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class PetController {
  constructor(private readonly service: PetService) {}

  @ApiOperation({ description: 'lookup device by serial number' })
  @ApiJsonResponse({ type: DeviceLookupResponseDto })
  @Get('/device-lookup/:serial')
  @HttpCode(HttpStatus.OK)
  async lookupDevice(@Param('serial') serial: string) {
    return await this.service.lookupDevice(serial);
  }

  @ApiOperation({ description: 'show all my pets' })
  @ApiJsonResponse({ type: PetResponseDto, isArray: true })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: PetFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: PetFilterDto, @GetUser() user: User) {
    return await this.service.findAll(filter, user);
  }

  @ApiOperation({ description: 'show my pet by given id' })
  @ApiJsonResponse({ type: PetResponseDto })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number, @GetUser() user: User) {
    return await this.service.findById(id, user);
  }

  @ApiOperation({ description: 'create pet' })
  @ApiJsonResponse({ type: PetResponseDto, status: 201 })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: PetDto, @GetUser() user: User) {
    return await this.service.create(dto, user);
  }

  @ApiOperation({ description: 'update my pet' })
  @ApiJsonResponse({ type: PetResponseDto })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: PetDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(id, dto, user);
  }

  @ApiOperation({ description: 'delete my pet' })
  @ApiJsonResponse({ type: PetResponseDto })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number, @GetUser() user: User) {
    return await this.service.deleteById(id, user);
  }
}
