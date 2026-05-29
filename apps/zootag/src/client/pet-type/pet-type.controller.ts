import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { JwtGuard } from '@rahino/auth';
import { ApiJsonResponse } from '@rahino/response';
import { PetTypeService } from './pet-type.service';
import { PetTypeResponseDto } from './dto';
import { ListFilter } from '@rahino/query-filter/types';

@ApiTags('Zootag-Client-PetTypes')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({ path: '/api/zootag/client/petTypes', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class PetTypeController {
  constructor(private readonly service: PetTypeService) {}

  @ApiOperation({ description: 'show all pet types' })
  @ApiJsonResponse({ type: PetTypeResponseDto, isArray: true })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }
}
