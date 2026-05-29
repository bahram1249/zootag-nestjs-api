import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ZTPetBreed } from '@rahino/localdatabase/models';
import { PetBreedController } from './pet-breed.controller';
import { PetBreedService } from './pet-breed.service';

@Module({
  imports: [SequelizeModule.forFeature([ZTPetBreed])],
  controllers: [PetBreedController],
  providers: [PetBreedService],
})
export class ClientPetBreedModule {}
