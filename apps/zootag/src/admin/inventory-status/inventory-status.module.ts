import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTInventoryStatus } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { InventoryStatusController } from './inventory-status.controller';
import { InventoryStatusService } from './inventory-status.service';
import { InventoryStatusProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTInventoryStatus, User, Permission])],
  controllers: [InventoryStatusController],
  providers: [InventoryStatusService, InventoryStatusProfile],
})
export class InventoryStatusModule {}
