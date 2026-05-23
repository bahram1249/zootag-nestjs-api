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
import { CommissionSettlementService } from './commission-settlement.service';
import { CommissionSettlementDto, CommissionSettlementFilterDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { CommissionSettlementResponseDto } from './dto';

@ApiTags('Zootag-Admin-CommissionSettlements')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({ path: '/api/zootag/admin/commissionSettlements', version: ['1'] })
@UseInterceptors(JsonResponseTransformInterceptor)
export class CommissionSettlementController {
  constructor(private readonly service: CommissionSettlementService) {}

  @ApiOperation({ description: 'show all commission settlements' })
  @ApiJsonResponse({ type: CommissionSettlementResponseDto, isArray: true })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.commissionsettlements.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: CommissionSettlementFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: CommissionSettlementFilterDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show commission settlement by given id' })
  @ApiJsonResponse({ type: CommissionSettlementResponseDto })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.commissionsettlements.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return await this.service.findById(id);
  }

  @ApiOperation({ description: 'create commission settlement' })
  @ApiJsonResponse({ type: CommissionSettlementResponseDto, status: 201 })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.commissionsettlements.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CommissionSettlementDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update commission settlement' })
  @ApiJsonResponse({ type: CommissionSettlementResponseDto })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.commissionsettlements.update',
  })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: CommissionSettlementDto) {
    return await this.service.update(id, dto);
  }

  @ApiOperation({ description: 'delete commission settlement' })
  @ApiJsonResponse({ type: CommissionSettlementResponseDto })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.commissionsettlements.delete',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') id: number) {
    return await this.service.deleteById(id);
  }
}
