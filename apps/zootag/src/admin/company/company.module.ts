import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTCompany } from '@rahino/localdatabase/models';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [SequelizeModule.forFeature([ZTCompany])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
