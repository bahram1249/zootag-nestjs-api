import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTPetBreed } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { PetBreedProfile } from './mapper';
import { PetBreedController } from './pet-breed.controller';
import { PetBreedService } from './pet-breed.service';

@Module({
  imports: [SequelizeModule.forFeature([ZTPetBreed, User, Permission])],
  controllers: [PetBreedController],
  providers: [PetBreedService, PetBreedProfile],
})
export class PetBreedModule { }
