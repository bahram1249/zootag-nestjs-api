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
import { CommissionSettlementStatusService } from './commission-settlement-status.service';
import { CommissionSettlementStatusFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { CommissionSettlementStatusResponseDto } from './dto';

@ApiTags('Zootag-Admin-CommissionSettlementStatuses')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/zootag/admin/commissionSettlementStatuses',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class CommissionSettlementStatusController {
  constructor(private readonly service: CommissionSettlementStatusService) {}

  @ApiOperation({ description: 'show all commission settlement statuses' })
  @ApiJsonResponse({
    type: CommissionSettlementStatusResponseDto,
    isArray: true,
  })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.commissionsettlementstatuses.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: CommissionSettlementStatusFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: CommissionSettlementStatusFilterDto) {
    return await this.service.findAll(filter);
  }
}
