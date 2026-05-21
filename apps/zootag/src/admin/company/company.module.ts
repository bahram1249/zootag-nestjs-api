import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTCompany } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([ZTCompany, User, Permission])],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyProfile],
})
export class CompanyModule {}
