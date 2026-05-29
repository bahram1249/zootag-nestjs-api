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
import { PetBreedService } from './pet-breed.service';
import { PetBreedResponseDto } from './dto';
import { ListFilter } from '@rahino/query-filter/types';

@ApiTags('Zootag-Client-PetBreeds')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({ path: '/api/zootag/client/petBreeds', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class PetBreedController {
  constructor(private readonly service: PetBreedService) {}

  @ApiOperation({ description: 'show all pet breeds' })
  @ApiJsonResponse({ type: PetBreedResponseDto, isArray: true })
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
