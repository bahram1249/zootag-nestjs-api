import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTPetType } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { PetTypeProfile } from './mapper';
import { PetTypeController } from './pet-type.controller';
import { PetTypeService } from './pet-type.service';


@Module({
  imports: [SequelizeModule.forFeature([ZTPetType, User, Permission])],
  controllers: [PetTypeController],
  providers: [PetTypeService, PetTypeProfile],
})
export class PetTypeModule { }
