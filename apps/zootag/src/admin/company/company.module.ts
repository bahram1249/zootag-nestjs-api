import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTCompany } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [SequelizeModule.forFeature([ZTCompany, User, Permission])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
