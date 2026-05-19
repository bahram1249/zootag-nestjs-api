import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UmzugMigrationService } from './umzug-migration.service';

@Module({
  imports: [SequelizeModule],
  providers: [UmzugMigrationService],
  exports: [UmzugMigrationService],
})
export class UmzugMigrationModule {}
