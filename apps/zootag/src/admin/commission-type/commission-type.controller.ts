import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { CommissionTypeService } from './commission-type.service';
import { CommissionTypeFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { CommissionTypeResponseDto } from './dto';

@ApiTags('Zootag-Admin-CommissionTypes')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/commissionTypes', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class CommissionTypeController {
  constructor(private readonly service: CommissionTypeService) {}

  @ApiOperation({ description: 'show all commission types' })
  @ApiJsonResponse({ type: CommissionTypeResponseDto, isArray: true })
  @CheckPermission({ permissionSymbol: 'zootag.admin.commissiontypes.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: CommissionTypeFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: CommissionTypeFilterDto) {
    return await this.service.findAll(filter);
  }
}
