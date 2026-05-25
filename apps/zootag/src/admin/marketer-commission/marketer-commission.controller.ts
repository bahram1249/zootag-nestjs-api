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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { MarketerCommissionService } from './marketer-commission.service';
import { MarketerCommissionDto } from './dto';

@ApiTags('Zootag-Admin-MarketerCommissions')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/zootag/admin/marketers/:marketerId/commissions',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class MarketerCommissionController {
  constructor(private readonly service: MarketerCommissionService) {}

  @ApiOperation({ description: 'show all commissions for a marketer' })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketercommissions.getall',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('marketerId') marketerId: number) {
    return await this.service.findAll(marketerId);
  }

  @ApiOperation({ description: 'show commission by given id' })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketercommissions.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('marketerId') marketerId: number,
    @Param('id') id: number,
  ) {
    return await this.service.findById(marketerId, id);
  }

  @ApiOperation({ description: 'create commission' })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketercommissions.create',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('marketerId') marketerId: number,
    @Body() dto: MarketerCommissionDto,
    @GetUser() user: User,
  ) {
    return await this.service.create(marketerId, dto, user);
  }

  @ApiOperation({ description: 'update commission' })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketercommissions.update',
  })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('marketerId') marketerId: number,
    @Param('id') id: number,
    @Body() dto: MarketerCommissionDto,
    @GetUser() user: User,
  ) {
    return await this.service.update(marketerId, id, dto, user);
  }

  @ApiOperation({ description: 'delete commission' })
  @CheckPermission({
    permissionSymbol: 'zootag.admin.marketercommissions.delete',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(
    @Param('marketerId') marketerId: number,
    @Param('id') id: number,
  ) {
    return await this.service.deleteById(marketerId, id);
  }
}
