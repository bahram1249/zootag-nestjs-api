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
import { InventoryStatusService } from './inventory-status.service';
import { InventoryStatusFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { InventoryStatusResponseDto } from './dto';

@ApiTags('Zootag-Admin-InventoryStatuses')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/inventoryStatuses', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class InventoryStatusController {
  constructor(private readonly service: InventoryStatusService) {}

  @ApiOperation({ description: 'show all inventory statuses' })
  @ApiJsonResponse({ type: InventoryStatusResponseDto, isArray: true })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.inventorystatuses.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: InventoryStatusFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: InventoryStatusFilterDto) {
    return await this.service.findAll(filter);
  }
}
